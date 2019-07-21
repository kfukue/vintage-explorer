import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import VintageExplorerContract from "./contracts/VintageExplorer.json";
import getWeb3 from "./utils/getWeb3";
import { Button } from 'rimble-ui'
import CustomToolBar from "./header/customToolBar/CustomToolBar.js";

import "./App.css";
import Container from '@material-ui/core/Container';
import Wines from './page/wines/wines';
import Admin from './page/admin/admin';
import WineProducer from './page/wineProducer/wineProducer';
import User from './page/user/user';
import { Route, Link, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom';
class App extends Component {
  constructor(props){
    super(props);
    this.state = { storageValue: 0, web3: null, accounts: null, contract: null };
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VintageExplorerContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VintageExplorerContract.abi,
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

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // // Update state with the result.
    // this.setState({ storageValue: response });
  };

  handleClick= async (event) => {
    const { storageValue, accounts, contract } = this.state;
    let newValue = +storageValue + 10;
    console.log(`new value : ${newValue}`);
    // Stores a given value, 10 by default.
    await contract.methods.set(newValue).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
        <div className="App">
          <Router>
                <CustomToolBar></CustomToolBar>
                <Container fixed>
                    <div className="content">
                      <h1>Good to Go!</h1>
          <Switch>
                        <Route exact path="/admin" render={() => <Admin  {...this.props} {...this.state}/>}/>
                        {/* <Route exact path="/wineProducers" component={WineProducer} />
                        <Route exact path="/user" component={User} /> */}
          </Switch>
                    </div>
                </Container>
          </Router>
        </div>
    );
  }
}

export default App;
