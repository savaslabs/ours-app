import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import firebaseConfig from '../firebaseConfig'
import './index.scss'

import protectedRoutes from './protectedRoutes'
import ProtectedRouteHoc from './ProtectedRouteHoc'
import Landing from './components/routes/Landing'

export const AuthContext = React.createContext(null)

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false)

  function readSession() {
    const user = window.sessionStorage.getItem(
      `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`
    )
    if (user) setLoggedIn(true)
  }
  useEffect(() => {
    readSession()
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
      <BrowserRouter>
        <Switch>
          <Route exact path={['/', '/welcome']} component={Landing} />
          {protectedRoutes.map((route) => (
            <ProtectedRouteHoc
              key={route.path}
              isLoggedIn={isLoggedIn}
              path={route.path}
              component={route.main}
              exact={route.exact}
              public={route.public}
            />
          ))}
        </Switch>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
