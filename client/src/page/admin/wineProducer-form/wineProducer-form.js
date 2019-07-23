import React, { Component } from "react";
import { Formik } from "formik";
import withStyles from "@material-ui/core/styles/withStyles";
import { WineProducerInputs } from "./wineProducer-inputs";
import Paper from "@material-ui/core/Paper";
import * as Yup from 'yup';
import VintageExplorerContract from "../../../contracts/VintageExplorer.json";
import SimpleStorageContract from "../../../contracts/SimpleStorage.json";
import getWeb3 from "../../../utils/getWeb3";
import { Route, Link, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import ProgressBar from '../../../header/progressBar/ProgressBar';

const validationSchema = Yup.object({
  name: Yup.string("Enter a name")
    .required("Name is required"),
  website: Yup.string("Enter a website")
    .required("Website is required"),
  wineProducer: Yup.string("Enter the wine producer's ethereum address")
    .required("Wine Producer Address is required"),
});
const styles = theme => ({
});

class WineProducerForm extends Component {
  constructor(props, state) {
    super(props);
    this.state = {
        showProgress : false,
        values : {
        name : '',
        website : '',
        wineProducer  : '',
        open : false,
        snackbarMsg : '',
        totalNumberOfWineProducers : 0,
        latestNumberWineProducerId : 0,
      }
      };
      this.getLatestWineProdcuers().then(()=>{});
  }

  clearValues(){
    this.setState({
      values : {
        name : '',
        website : '',
        wineProducer : '',
        open : false,
        snackbarMsg : '',
        totalNumberOfWineProducers : 0,
        latestNumberWineProducerId : 0,
      }
    })
  }

  getLatestWineProdcuers = async () => {
    try {
      const {accounts, contract } = this.props;
      const totalNumberOfWineProducers = await contract.methods.numWineProducers().call();
      let wineProducerId = totalNumberOfWineProducers;
      if(totalNumberOfWineProducers > 0){
        wineProducerId = totalNumberOfWineProducers -1;
      }
      this.setState({
        totalNumberOfWineProducers : totalNumberOfWineProducers,
        latestNumberWineProducerId : wineProducerId
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

  handleSubmit = async (value,resetForm) => {
    try {
    const {accounts, contract } = this.props;
    this.setState({
      showProgress : true,
    });
    const name = value.name;
    const website = value.website;
    const wineProducer = value.wineProducer
    const newWineId = await contract.methods.addWineProducer(name,website,wineProducer).call({ from: accounts[0] });
    this.setState({
      snackbarMsg : `Successfully addded ${name} id is : ${newWineId}`,
    })
    this.openSnackbar();
    this.clearValues();
    this.setState({
      showProgress : false,
    });
    await this.getLatestWineProdcuers();
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
    const test = this.props.test;
    return (
      <React.Fragment>
          {this.state.showProgress ? <ProgressBar /> : null}
          <div className={classes.container}>
          <Paper elevation={1} className={classes.paper}>
            <h1>Add Wine Producer</h1>
            <h2>Total Number of Wine Producers : {this.state.totalNumberOfWineProducers}</h2>
            <h2>Latest Added Wine Producer ID : {this.state.latestNumberWineProducerId}</h2>
            <Formik
              render={props => <WineProducerInputs {...props} />}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                this.handleSubmit(values);
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
                </IconButton>,
              ]}
            />
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(WineProducerForm);
