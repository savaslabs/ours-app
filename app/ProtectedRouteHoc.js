import React, { useState, useEffect } from 'react'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { bool, any, object } from 'prop-types'

// Firebase/firestore.
import * as FirestoreService from './firestore'
import * as firebase from 'firebase/app'

const ProtectedRouteHoc = ({ component: Component, isLoggedIn, ...rest }) => {
    const [currentUser, setCurrentUser] = useState(
      firebase.auth().currentUser.uid
    )

    const [groupIds, setGroupIds] = useState([])
    const [groups, setGroups] = useState()

    // Use an effect hook to subscribe to the item stream and
    // automatically unsubscribe when the component unmounts.
    useEffect(() => {
      const unsubscribe = FirestoreService.streamAssociatedGroups(currentUser, {
        next: (querySnapshot) => {
          const updatedGroupIds = querySnapshot.docs.map((docSnapshot) =>
            docSnapshot.id
          )

          const updatedGroups = querySnapshot.docs.map((docSnapshot) =>
            docSnapshot.data()
          )
          setGroups(updatedGroups)
          setGroupIds(updatedGroupIds)
        }
      })
      return unsubscribe
    }, [currentUser, setGroupIds, setGroups])

  if (isLoggedIn || rest.public || groups.length > 0 || groupIds.length > 0) {
    return (
      <Route
        {...rest}
        render={(props) => {
          return <Component currentUser={currentUser} groups={groups} groupIds={groupIds} {...props}></Component>
        }}
      />
    )
  }
  return <Redirect to={{ pathname: '/' }} />
}

ProtectedRouteHoc.propTypes = {
  component: any,
  isLoggedIn: bool,
  rest: object,
  props: object
}

export default withRouter(ProtectedRouteHoc)
