import React, { useState, useEffect } from 'react'
import AddGroupForm from '../forms/AddGroup'
import * as FirestoreService from '../../firestore'
import * as firebase from 'firebase/app'

function Community() {
  const [currentUser, setCurrentUser] = useState(
    firebase.auth().currentUser.uid
  )

  const [associatedGroups, setAssociatedGroups] = useState()

  // Use an effect hook to subscribe to the item stream and
  // automatically unsubscribe when the component unmounts.
  useEffect(() => {
    const unsubscribe = FirestoreService.streamAssociatedGroups(currentUser, {
      next: (querySnapshot) => {
        const updatedGroups = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setAssociatedGroups(updatedGroups)
      }
    })
    return unsubscribe
  }, [currentUser, setAssociatedGroups])

  return (
    <React.Fragment>
      <h1>Community Page</h1>
      {associatedGroups && associatedGroups.map((group, i) => <div key={i}>{group.groupName}</div>)}
      <AddGroupForm />
    </React.Fragment>
  )
}

export default Community
