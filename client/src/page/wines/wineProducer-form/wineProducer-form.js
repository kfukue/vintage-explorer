import React, { Component } from "react";
import { Formik } from "formik";
import withStyles from "@material-ui/core/styles/withStyles";
import { WineProducerInputs } from "./wineProducer-inputs";
import Paper from "@material-ui/core/Paper";
import * as Yup from 'yup';
import VinetageExplorerContract from "./contracts/vinetageExplorer.json";
import getWeb3 from "./utils/getWeb3";

const validationSchema = Yup.object({
  name: Yup.string("Enter a name")
   .required("Name is required"),
  email: Yup.string("Enter your email")
    .required("Email is required"),
});
const styles = theme => ({
 

});

class WineProducerForm extends Component {
 constructor(props) {
   super(props);
   this.state = {
    wineProducerId : 0,
     value : {
       name : '',
       website : '',
       wineProducer : ''
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
    const deployedNetwork = VinetageExplorerContract.networks[networkId];
    const instance = new web3.eth.Contract(
      VinetageExplorerContract.abi,
      deployedNetwork && deployedNetwork.address,
    );

    // Set web3, accounts, and contract to the state, and then proceed with an
    // example of interacting with the contract's methods.
    this.setState({ web3, accounts, contract: instance });
  } catch (error) {
    // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`,
    );
    console.error(error);
  }
};

addWineProducer= async () => {
  const { value, accounts, contract } = this.state;
  
  const name = value.name;
  const website = value.website;
  const wineProducer = value.wineProducer;
  const response = await contract.methods.addWineProducer(name,website,wineProducer).send({ from: accounts[0] });

  // Get the value from the contract to prove it worked.
  // const response = await contract.methods.get().call();

  // Update state with the result.
  this.setState({ wineProducerId: response });
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
             onSubmit={(values, actions) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                actions.setSubmitting(false);
              }, 1000);
            }}
       
           />
         </Paper>
       </div>
     </React.Fragment>
   );
 }
}

export default withStyles(styles)(WineProducerForm);
