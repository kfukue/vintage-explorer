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
import BigNumber from "bignumber.js"
import Button from '@material-ui/core/Button';

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
    const {accounts} = this.props;
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
        balance : 0,
      }
    };
    this.getLatestWineIdFromWineProducer().then(()=>{});
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

 getLatestWineIdFromWineProducer = async () => {
  try {
    const {accounts, contract} = this.props;
    const numWineProducers = await contract.methods.numWineProducers().call();
    this.setState({
      numWineProducers : numWineProducers
    });
    const wineProducerResults = await contract.methods.readWineProducerByAccount(accounts[0]).call();
    this.setState({
      wineProducer : {
        wineProducerId : wineProducerResults.wineProducerId,
        name : wineProducerResults.name,
        website : wineProducerResults.website,
        numWines : wineProducerResults.numWines,
        balance : wineProducerResults.balance
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

  handleSubmit = async (value, resetForm) => {
    try {
      this.setState({
        showProgress : true
      });
      const {accounts, contract, web3 } = this.props;
      const wineProducerId = this.state.wineProducer.wineProducerId;
      const name = value.name;
      const description = value.description;
      const sku = value.sku;
      const vintage = value.vintage
      const totalSupply = value.totalSupply;
      const price = web3.utils.toWei(value.price,'ether');
      const newWineId = await contract.methods.addWine(wineProducerId,name,description,
        sku, vintage, totalSupply,price)
      .send({
        from: accounts[0],
      });
      resetForm({});
      await this.getLatestWineIdFromWineProducer()
      this.setState({
        newWineId : newWineId,
        showProgress : false,
        snackbarMsg : `Successfully addded new wine ${name}`
      });
      this.openSnackbar();
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

  handleWithdraw= async (event) => {
    this.setState({
      showProgress : true,
    })
    const {accounts, contract, web3 } = this.props;
    const balance = BigNumber(this.state.wineProducer.balance).toString();
    await contract.methods.withdraw().send({
      from: accounts[0]
    });
    await this.getLatestWineIdFromWineProducer();
    let msg = `Successfully withdrew ${web3.utils.fromWei(balance, 'ether')} ETH!`;
    this.setState({
      snackbarMsg : msg,
      showProgress : false
    })
    this.openSnackbar();
  };

  render() {
    const classes = this.props.classes;
    const web3 = this.props.web3;
    return (
      <React.Fragment>
        {this.state.showProgress ? <ProgressBar /> : null}
          <div className={classes.container}>
          <Paper elevation={1} className={classes.paper}>
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
              <Typography gutterBottom color="textSecondary" paragraph>
                Balance : {web3.utils.fromWei(BigNumber(this.state.wineProducer.balance).toString(), 'ether')} ETH
                <Button onClick ={this.handleWithdraw.bind(this)}  size="small" color="primary" disabled ={this.state.wineProducer.balance <=0}>
                  Withdraw balance
                </Button>
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
