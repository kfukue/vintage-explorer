import React, { Component } from "react";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import withStyles from "@material-ui/core/styles/withStyles";
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import ProgressBar from '../../header/progressBar/ProgressBar';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },

  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    flexBasis: 200,
  },
  button: {
    margin: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
});

class User extends Component {

  constructor(props, state) {
    super(props);
    const {accounts, contract } = this.props;
    this.state = {
      showProgress : false,
      totalWineProducers : -1,
      ownedWines : [],
      open : false,
      totalOwnedWineCount : 0
    };
    this.getWineProducers().then(()=>{});
  }

  clearValues(){
    this.setState({
      showProgress : false,
      totalWineProducers : -1,
      ownedWines : [],
      totalOwnedWineCount : 0
    });
  }

  getWineProducers = async () => {
    try {
      const {accounts, contract} = this.props;
      this.setState({
        showProgress : true,
      })
      const numWineProducers = await contract.methods.numWineProducers().call();
      this.setState({
        totalWineProducers : numWineProducers
      });
      let totalOwnedWineCount = 0;
      this.setState({
        wineProducers : []
      });
      let updatedOwnedWines = [];
      for(let i = 0; i < numWineProducers; i++){
        const wineProducerResults = await contract.methods.readWineProducerById(i).call();
        const numberOfWines = wineProducerResults.numWines;
        if(numberOfWines > 0){
          for(let j = 0; j < numberOfWines; j++){
            const wineResults = await contract.methods.readWineDescription(i,j).call();
            const wineOwnerResults = await contract.methods.getOwnersNumberOfWines(i,j).call({from: accounts[0]});
            const purchasedWines = +wineOwnerResults;
            if(purchasedWines > 0){
              let ownedWinesResult = {
                wineProducerId : i,
                wineProducerName : wineProducerResults.name,
                wineId : j,
                name : wineResults.name,
                description : wineResults.description,
                sku : wineResults.sku,
                vintage : wineResults.vintage,
                totalAmountOwned : purchasedWines,
              }
              totalOwnedWineCount += purchasedWines;
              updatedOwnedWines.push(ownedWinesResult);
            }
          }
        }
      }
      this.setState({
        ownedWines : updatedOwnedWines,
        totalOwnedWineCount : totalOwnedWineCount
      })
      this.setState({
        showProgress : false,
      });
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.${error}`,
      );
      console.error(error);
      this.setState({
        showProgress : false,
      });
    }
  }
  handleRefundWine= async (event) => {
    this.setState({
      showProgress : true,
    })
    const {accounts, contract, web3 } = this.props;
    const ownedWineIndex = +event;
    const wine = this.state.ownedWines[ownedWineIndex];
    const wineId = wine.wineId;
    const wineProducerId = wine.wineProducerId;
    const qty = wine.totalAmountOwned;
    const amount = wine.totalAmountOwned;
    const response = await contract.methods.getRefund(wineProducerId,wineId).send({ from: accounts[0]});
    let msg = `Successfully refund wine ${wine.name} quantity was : ${qty}`;
    this.setState({
      snackbarMsg : msg
    })
    this.openSnackbar();
    setTimeout(() => {
      this.getWineProducers().then(()=>{});
      this.setState({
        showProgress : false,
      })
    },
     3000);
  };

  openSnackbar(){
    this.setState({
      open : true
    });
  }

  closeSnackbar(){
    this.setState({
      open : false
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.state.showProgress ? <ProgressBar /> : null}
          <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h2" align="center" color="textPrimary" gutterBottom>
              Welcome : {this.props.accounts[0]}
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Total Owned Wines : {this.state.totalOwnedWineCount}
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Wine Producers : {this.state.totalWineProducers}
            </Typography>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {this.state.ownedWines.map((ownedWine, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h5">
                      {ownedWine.wineProducerName}
                    </Typography>
                    <Typography gutterBottom color="textSecondary" paragraph>
                      Wine Name : {ownedWine.name}
                    </Typography>
                    <Typography gutterBottom color="textSecondary" paragraph>
                      Number of wines owned : {ownedWine.totalAmountOwned}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.closeSnackbar.bind(this)}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.snackbarMsg}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.closeSnackbar.bind(this)}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default withStyles(styles)(User);