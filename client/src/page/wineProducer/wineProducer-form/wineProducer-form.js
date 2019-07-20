import React, { Component } from "react";
import { Formik } from "formik";
import withStyles from "@material-ui/core/styles/withStyles";
import { WineProducerInputs } from "./wineProducer-inputs";
import Paper from "@material-ui/core/Paper";
import * as Yup from 'yup';
import VintageExplorerContract from "../../../contracts/VintageExplorer.json";
import SimpleStorageContract from "../../../contracts/SimpleStorage.json";
import getWeb3 from "../../../utils/getWeb3";
const validationSchema = Yup.object({
  name: Yup.string("Enter a name")
   .required("Name is required"),
  wineProducer: Yup.string("Enter the wine producer's ethereum address")
    .required("Wine Producer Address is required"),
});
const styles = theme => ({
 

});

class WineProducerForm extends Component {
 constructor(props) {
   super(props);
   this.state = { newWineProducerId: 0, web3: null, accounts: null, contract: null ,
    values : {
      name : '',
      website : '',
      wineProducer  : ''
    }
    };
 }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      console.log('instance', instance);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
     this.setState({ web3, accounts, contract: instance });
    } 
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  handleSubmit = async (value) => {
    try {
    const {accounts, contract } = this.state;
    // Stores a given value, 10 by default.
    const name = value.name;
    const website = value.website;
    const wineProducer = value.wineProducer
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();
    // const wineId = await contract.methods.addWineProducer(name,website,wineProducer).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    //const response = await contract.methods.readWineProducer(wineId).call();

    // Update state with the result.
    //this.setState({ newWineProducerId: response });
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.${error}`,
      );
      console.error(error);
    }
  };


 render() {
   const classes = this.props;
   return (
     <React.Fragment>
        <div className={classes.container}>
         <Paper elevation={1} className={classes.paper}>
           <h1>Form</h1>
           <Formik
             render={props => <WineProducerInputs {...props} />}
             validationSchema={validationSchema}
             onSubmit={values => {
              // same shape as initial values
              console.log(values);
              alert(JSON.stringify(values))
              this.handleSubmit(values);
            }}
           />
         </Paper>
       </div>
     </React.Fragment>
   );
 }
}

export default withStyles(styles)(WineProducerForm);
