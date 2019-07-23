import React, { Component } from "react";
import { Formik } from "formik";
import withStyles from "@material-ui/core/styles/withStyles";
import { WineInputs } from "./wine-inputs";
import Paper from "@material-ui/core/Paper";
import * as Yup from 'yup';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ProgressBar from '../../../header/progressBar/ProgressBar';
import Typography from '@material-ui/core/Typography';

const validationSchema = Yup.object({
  name: Yup.string("Enter a name")
   .required("Name is required"),
  description: Yup.string("Enter a description")
    .required("Description is required"),
  sku: Yup.string("Enter a sku")
    .required("Sku is required"),
  vintage: Yup.string("Enter a vintage")
    .required("Vintage is required"),
  totalSupply: Yup.string("Enter a totalSupply")
    .required("TotalSupply is required"),
  price: Yup.string("Enter a price")
    .required("Price is required"),
});
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class WineForm extends Component {
  constructor(props, state) {
    console.log('wineform', props);
    super(props);
    const {accounts, contract } = this.props;
    this.state = {
      showProgress : false,
      currentAccount : JSON.stringify(accounts),
      newWineId : -1,
      numWineProducers : -1,
      values : {
        name : '',
        description : '',
        sku  : '',
        vintage : 0,
        totalSupply : 0,
        price : 0,
        totalSales : 0,
        open : false,
        snackbarMsg : '',
        totalNumberOfWines : 0,
        latestNumberWineId : 0,
      },
      wineProducer : {
        name : '',
        website : '',
        numWines : 0,
      }
    };
  }

  clearValues(){
    this.setState({
      values : {
        name : '',
        description : '',
        sku  : '',
        vintage : 0,
        totalSupply : 0,
        price : 0,
        totalSales : 0,
        open : false,
        snackbarMsg : '',
        totalNumberOfWines : 0,
        latestNumberWineId : 0,
      }
    });
  }

 getLatestWineIdFromWineProdcuer = async (wineProducerAddress) => {
  try {
    const {accounts, contract} = this.props;
    const numWineProducers = await contract.methods.numWineProducers().call();
    // const wineProducerId = await contract.methods.numWineProducers().call();
    this.setState({
      numWineProducers : numWineProducers
    });
    // const wineProducerResults = await contract.methowds.readWineProducer(wineProducerId).call();
    const wineProducerResults = await contract.methods.readWineProducerByAccount(accounts[0]).call();
    this.setState({
      wineProducer : {
        wineProducerId : wineProducerResults.wineProducerId,
        name : wineProducerResults.name,
        website : wineProducerResults.website,
        numWines : wineProducerResults.numWines,
      }
    });
  }
  catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.${error}`,
    );
    console.error(error);
   }
 }

  handleSubmit = async (value) => {
    try {
      this.setState({
        showProgress : true
      });
      const {accounts, contract, web3 } = this.props;
      // Stores a given value, 10 by default.
      const wineProducerId = this.state.wineProducer.wineProducerId;
      const name = value.name;
      const description = value.description;
      const sku = value.sku;
      const vintage = value.vintage
      const totalSupply = value.totalSupply;
      const price = web3.utils.toWei(value.price,'ether');
      const newWineId = await contract.methods.addWine(wineProducerId,name,description,
        sku, vintage, totalSupply,price).call({ from: accounts[0] });
      this.setState({
        newWineId : newWineId
      });
      this.setState({
        snackbarMsg : `Successfully addded new win ${name} id is : ${newWineId}`,
      })
      this.openSnackbar();
      setTimeout(() => {
        this.clearValues();
        this.setState({
          showProgress : false
        });
      },
      3000);
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.${error}`,
      );
      console.error(error);
      this.setState({
        showProgress : false
      });
    }
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
    const classes = this.props.classes;
    this.getLatestWineIdFromWineProdcuer().then(()=>{});
    return (
      <React.Fragment>
        {this.state.showProgress ? <ProgressBar /> : null}
          <div className={classes.container}>
          <Paper elevation={1} className={classes.paper}>
          <Typography gutterBottom color="textSecondary" paragraph>
                Welcome : {this.props.accounts[0]}
              </Typography>
              <Typography component="h1" color="textPrimary" gutterBottom>
                Wine Producer : {this.state.wineProducer.name}
              </Typography>
              <Typography gutterBottom color="textSecondary" paragraph>
                Wine producer id : {this.state.wineProducer.wineProducerId}
              </Typography>
              <Typography gutterBottom color="textSecondary" paragraph>
                Website : {this.state.wineProducer.website}
              </Typography>
              <Typography gutterBottom color="textSecondary" paragraph>
                Number Of Wines : {this.state.wineProducer.numWines}
              </Typography>
            <Formik
              render={props => <WineInputs {...props} />}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                this.handleSubmit(values, resetForm);
              }}
            />
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
                </IconButton>
              ]}
            />
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(WineForm);
