import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import firebaseConfig from '../firebaseConfig'
import * as FirestoreService from './firestore'

import './index.scss'
import '@babel/polyfill'

import Header from './components/Header'
import Landing from './components/routes/Landing'
import protectedRoutes from './ProtectedRoutes'
import ProtectedRouteHoc from './ProtectedRouteHoc'

export const AuthContext = React.createContext(null)

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState()
  const [groupIds, setGroupIds] = useState([])
  const [groups, setGroups] = useState()
  const [allUserItems, setAllUserItems] = useState([])

  function readSession() {
    const user = window.sessionStorage.getItem(
      `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`
    )

    if (user) {
      setLoggedIn(true)
      setCurrentUser(JSON.parse(user).uid)
    }
  }
  useEffect(() => {
    readSession()
  }, [])


  function fetchData() {
      // Use an effect hook to subscribe to the item stream and
    // automatically unsubscribe when the component unmounts.
    if (currentUser) {
      const unsubscribe = FirestoreService.streamAssociatedGroups(currentUser, {
        next: (querySnapshot) => {
          const updatedGroupIds = querySnapshot.docs.map(
            (docSnapshot) => docSnapshot.id
          )

          const updatedGroups = querySnapshot.docs.map((docSnapshot) => {
            let updatedGroups = docSnapshot.data()
            updatedGroups['id'] = docSnapshot.id

            return updatedGroups
          })
          setGroups(updatedGroups)
          setGroupIds(updatedGroupIds)
        }
      })
      return unsubscribe
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentUser, setGroupIds, setGroups])

  function fetchItems() {
    if (groupIds.length > 0) {
      const unsubscribe = FirestoreService.streamItems(groupIds, {
        next: (querySnapshot) => {
          const item = querySnapshot.docs.map((docSnapshot) => {
            let item = docSnapshot.data()
            item['id'] = docSnapshot.id

            return item
          })
          setAllUserItems(item)
        }
      })
      return unsubscribe
    } else {
      console.log('groupIds havent loaded yet')
    }
  }

  useEffect(() => {
    fetchItems()
  }, [groupIds, setAllUserItems])

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setLoggedIn, currentUser, groups, groupIds, allUserItems }}
    >
      Is logged in? {JSON.stringify(isLoggedIn)}
      Current user: {currentUser}
      <BrowserRouter>
        <Header isLoggedIn={isLoggedIn} />
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
              groupIds={groupIds}
              groups={groups}
            />
          ))}
        </Switch>
      </BrowserRouter>

    </AuthContext.Provider>
  )
}

export default App
