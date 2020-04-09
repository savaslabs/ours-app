import React, { useState, useEffect } from 'react'
import * as FirestoreService from '../../firestore'
import * as firebase from 'firebase/app'

function Inventory() {
  const [currentUser, setCurrentUser] = useState(
    firebase.auth().currentUser.uid
  )

  // temporarily set groupId for dev.
  const [groupId, setGroupId] = useState(
    'zAGGtLgp4nmnKVGdPeiw'
  )
  const [groupIds, setGroupIds] = useState()
  const [items, setItems] = useState()

  // Use an effect hook to subscribe to the item stream and
  // automatically unsubscribe when the component unmounts.
  useEffect(() => {
    const unsubscribe = FirestoreService.streamAssociatedGroups(currentUser, {
      next: (querySnapshot) => {
        const updatedGroupIds = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.id
        )
        setGroupIds(updatedGroupIds)
      }
    })
    return unsubscribe
  }, [currentUser, setGroupIds])

  // Use an effect hook to subscribe to the item stream and
  // automatically unsubscribe when the component unmounts.
  // TODO: streamItems should take in groupIds and subscribe to groupIds
  useEffect(() => {
    FirestoreService.streamItems(
      groupId,
      {
        next: (querySnapshot) => {
          const updatedItems = querySnapshot.docs.map(
            (docSnapshot) => docSnapshot.data()
          )
          setItems(updatedItems)
        }
      }
    )
  }, [groupId, setItems])

  return (
    <main>
      <h1>Inventory Page</h1>
      {items && items.map((item, i) => <div key={i}>{item.name}</div>)}
    </main>
  )
}

export default Inventory
