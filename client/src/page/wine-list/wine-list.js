import React, { Component } from "react";
import { Formik } from "formik";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import * as Yup from 'yup';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

const styles = theme => ({
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

class WineList extends Component {
    constructor(props, state) {
      console.log('wineform', props);
      super(props);
      const {accounts, contract } = this.props;
      this.state = {
        totalWineProducers : -1,
        totalWines : -1,
        wineProducers : [],
        open : false,
      };
      this.getWineProducers().then(()=>{});
    }

  clearValues(){
    this.setState({
      totalWineProducers : -1,
      totalWines : -1,
      wineProducers : [],
      open : false
    });
  }

  getWineProducers = async () => {
    try {
      const {accounts, contract} = this.props;
      const numWineProducers = await contract.methods.numWineProducers().call();
      this.setState({
        totalWineProducers : numWineProducers
      });
      let totalWines = 0;
      this.setState({
        wineProducers : []
      });
      let updatedWineProducers = [];
      for(let i = 0; i < numWineProducers; i++){
        const wineProducerResults = await contract.methods.readWineProducerById(i).call();
        let wineProducer = {
          name : wineProducerResults.name,
          website : wineProducerResults.website,
          numWines : wineProducerResults.numWines,
          wineLink : `wineProducer/${i}`
        }
        updatedWineProducers.push(wineProducer);
      }
      this.setState({
          wineProducers : updatedWineProducers
      })
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.${error}`,
      );
      console.error(error);
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

 render() {
  const classes = this.props.classes;
  
   return (
     <React.Fragment>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Welcome to Vintage Explorer!
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Total Number Of Wine Producers : {this.state.totalWineProducers}
            </Typography>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {this.state.wineProducers.map((wineProducer, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {wineProducer.name}
                    </Typography>
                    <Typography gutterBottom color="textSecondary" paragraph>
                      URL : {wineProducer.website}
                    </Typography>
                    <Typography gutterBottom color="textSecondary" paragraph>
                      Number of wines : {wineProducer.numWines}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Typography variant="button" className={classes.title}>
                      <Link to={wineProducer.wineLink}>View Wines</Link>
                    </Typography>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <div className={classes.container}>
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

export default withStyles(styles)(WineList);
