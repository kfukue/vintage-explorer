import React, { Component } from "react";
import VintageExplorerContract from "./contracts/VintageExplorer.json";
import getWeb3 from "./utils/getWeb3";
import CustomToolBar from "./header/customToolBar/CustomToolBar.js";
import "./App.css";
import Container from '@material-ui/core/Container';
import Admin from './page/admin/admin';
import WineProducer from './page/wineProducer/wineProducer';
import User from './page/user/user';
import WineList from './page/wine-list/wine-list';
import ShopWine from './page/wine-list/shop-wine';

import { Route, Link, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom';
class App extends Component {
  constructor(props){
    super(props);
    this.state = { 
      web3: null,
      accounts: null,
      contract: null,
      isAdmin : false,
      isWineProducer : false
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
      const deployedNetwork = VintageExplorerContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VintageExplorerContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and check credentials of address
      const isAdmin = await instance.methods.checkIfAdmin().call({from: accounts[0]});
      const isWineProducer = await instance.methods.checkIfWineProducer().call({from: accounts[0]});
      this.setState({ web3, accounts, contract: instance, isAdmin : isAdmin , isWineProducer : isWineProducer });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Router>
          <CustomToolBar isAdmin={this.state.isAdmin} isWineProducer={this.state.isWineProducer}></CustomToolBar>
          <Container fixed>
            <div className="content">
              <Switch>
                <Route exact path="/" render={() => <WineList  {...this.props} {...this.state}/>}/>
                <Route exact path="/admin" render={() => <Admin  {...this.props} {...this.state}/>}/>
                <Route exact path="/wineProducers" render={() => <WineProducer  {...this.props} {...this.state}/>}/>
                <Route exact path="/user" render={() => <User  {...this.props} {...this.state}/>}/>
                <Route exact path="/wineProducer/:wineProducerId" render={(props) => <ShopWine  {...this.props} {...this.state} {...props}/>}/>
              </Switch>
            </div>
          </Container>
        </Router>
      </div>
    );
  }
}

export default App;
