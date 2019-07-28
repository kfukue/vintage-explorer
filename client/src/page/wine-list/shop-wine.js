import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import BigNumber from "bignumber.js"
import ProgressBar from '../../header/progressBar/ProgressBar';

const styles = theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 0, 6),
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

class ShopWine extends Component {
  constructor(props, state) {
    super(props);
    this.state = {
      showProgress : false,
      wineProducerId : -1,
      wineProducer : {
        name : '',
        website : '',
        numWines : '',
      },
      wines : [],
      open : false,
    };
    const { match: { params } } = this.props;
    // alert(`update wineproducerid : ${params.wineProducerId}`)
    if(params.wineProducerId){
      const wineProducerId = +params.wineProducerId;
      this.getWines(wineProducerId).then(()=>{});
    }
  }

  clearValues(){
    this.setState({
      twineProducerId : 0,
      wines : [],
      open : false,
    });
  }

 getWines = async (_wineProducerId) => {
  try {
    this.setState({
      showProgress : true,
    })
    const {contract} = this.props;
    const wineProducerId = +_wineProducerId;
    const wineProducerResults = await contract.methods.readWineProducerById(wineProducerId).call();
    let wineProducer = {
      name : wineProducerResults.name,
      website : wineProducerResults.website,
      numWines : wineProducerResults.numWines,
    }
    this.setState({
      wineProducer : wineProducer
    });
    let updatedWines = [];
    for(let i = 0; i < wineProducerResults.numWines; i++){
      const wineDescriptionResults = await contract.methods.readWineDescription(wineProducerId,i).call();
      const wineSalesRelatedResults = await contract.methods.readWineSalesRelated(wineProducerId,i).call();
      let wineResults = {
        wineId : i,
        name : wineDescriptionResults.name,
        description : wineDescriptionResults.description,
        sku : wineDescriptionResults.sku,
        vintage : wineDescriptionResults.vintage,
        totalSupply : wineSalesRelatedResults.totalSupply,
        price : wineSalesRelatedResults.price,
        totalSales : wineSalesRelatedResults.totalSales,
        buyQty : 1,
      }
      updatedWines.push(wineResults);
    }
    this.setState({
        wines : updatedWines,
        showProgress : false,
        wineProducerId : +wineProducerId
    })
  }
  catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.${error}`,
    );
    console.error(error);
    this.setState({
      showProgress : false,
    })
  }
}

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

  qtyOnChange (wineId, event){
    let wines = this.state.wines;
    const newQty = event.target.value;
    wines[wineId].buyQty = newQty;
    this.setState({
      wines : wines
    });
  };

  handleBuyClick= async (event) => {
    try {
      this.setState({
        showProgress : true,
      })
      const {accounts, contract, web3 } = this.props;
      const wineId = event;
      const wineProducerId = this.state.wineProducerId;
      const wine = this.state.wines[wineId];
      const qty = wine.buyQty;
      const amount = BigNumber(wine.price * qty).toString();
      await contract.methods.buyWine(wineProducerId,wineId,qty).send({ 
        from: accounts[0],
        value : amount
      });
      let msg = `Successfully bought new wine ${wine.name} id is : ${qty} for : ${web3.utils.fromWei(amount, 'ether')} ETH`;
      this.setState({
        snackbarMsg : msg
      })
      this.openSnackbar();
      this.getWines(wineProducerId).then(()=>{
        let wines = this.state.wines;
        wines[wineId].buyQty = 1;
        this.setState({
          wines : wines,
          showProgress : false,
        });
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
      })
    }

  };
  render() {
    const classes = this.props.classes;
    const web3 = this.props.web3;
    return (
      <React.Fragment>
        {this.state.showProgress ? <ProgressBar /> : null}
          <div className={classes.heroContent}>
            <Container maxWidth="sm">
              <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                {this.state.wineProducer.name}
              </Typography>
              <Typography variant="h5" align="center" color="textSecondary" paragraph>
                URL : {this.state.wineProducer.website}
              </Typography>
              <Typography variant="h5" align="center" color="textSecondary" paragraph>
                Number of wines : {this.state.wineProducer.numWines}
              </Typography>
            </Container>
          </div>
          <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {this.state.wines.map((wine, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {wine.name}
                      </Typography>
                      <Typography gutterBottom color="textSecondary" paragraph>
                        Description : {wine.description}
                      </Typography>
                      <Typography gutterBottom color="textSecondary" paragraph>
                        sku : {wine.sku}
                      </Typography>
                      <Typography gutterBottom color="textSecondary" paragraph>
                        vintage : {wine.vintage}
                      </Typography>
                      <Typography gutterBottom color="textSecondary" paragraph>
                        totalSupply : {wine.totalSupply}
                      </Typography>
                      <Typography gutterBottom color="textSecondary" paragraph>
                        Price : {web3.utils.fromWei(wine.price, 'ether')} ETH
                      </Typography>
                      <Typography gutterBottom color="textSecondary" paragraph>
                        Total Sales : {wine.totalSales}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Grid container
                        direction="row"
                        justify="bottom"
                        alignItems="bottom">
                        <Grid item xs={4}>
                          <TextField
                            name="qty"
                            className={classes.textField}
                            label="Quantity"
                            value={wine.buyQty}
                            onChange={this.qtyOnChange.bind(this, wine.wineId)}
                          >
                          </TextField>
                        </Grid>
                        <Grid item xs={8}>
                          <Button onClick ={this.handleBuyClick.bind(this, wine.wineId)}  size="small" color="primary">
                            Buy This Wine!
                          </Button>
                        </Grid>
                    </Grid>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
          <div className={classes.container}>
          <Paper elevation={1} className={classes.paper}>
          </Paper>
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
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ShopWine);
