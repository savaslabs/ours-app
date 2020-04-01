import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './index.scss'
import Landing from './components/routes/Landing'
import Inventory from './components/routes/Inventory'
import Community from './components/routes/Community'
import Profile from './components/routes/Profile'

function App() {

  return (
    <BrowserRouter>
      <Switch>
        {/* Todo: update paths based on component being developed. */}
        <Route exact path={'/welcome'} component={Landing} />
        <Route exact path={'/inventory'} component={Inventory} />
        <Route exact path={'/'} component={Community} />
        <Route exact path={'/profile'} component={Profile} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
