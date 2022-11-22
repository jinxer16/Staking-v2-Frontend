import React, { useEffect } from 'react';
import useEagerConnect from 'hooks/useEagerConnect';
import logo from './logo.svg';
import Navbar from './components/Navbar'
import Twitter from './components/Modals/Twitter'
import Landing from './views/Landing'
import Roadmap from './views/Roadmap'
import Tokenomics from './views/Tokenomics'
import background from "./assets/bg.webp";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { DEFAULT_CHAIN_ID } from 'config';
import { useFetchPublicData } from 'state/hooks';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import useRefresh from 'hooks/useRefresh';
import { fetchPoolsUserDataAsync } from 'state/pools';



function App() {
  useEagerConnect(DEFAULT_CHAIN_ID)
  useFetchPublicData()
  const dispatch = useDispatch()
  const { slowRefresh, fastRefresh } = useRefresh()

  const { account } = useWeb3React()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, slowRefresh])

  return (
      <Router>
        <Navbar/>
        {/* <Twitter/> */}
        
        <div className="background">
          <img src={background} alt="" />
        </div>
       
        <div className="middlesec">
          <Switch>
            <Route exact path="/">
                <Landing />
              </Route>Tokenomics
              <Route  path="/roadmap">
                <Roadmap />
              </Route>
              <Route  path="/tokenomics">
                <Tokenomics />
              </Route>
          </Switch>
        </div>
      </Router>
  );
}

export default App;
