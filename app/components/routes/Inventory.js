import React, { useState, useEffect } from 'react'
import * as FirestoreService from '../../firestore'

function Inventory() {
  // temporarily set groupId for dev.

  const [groupId, setGroupId] = useState(
    'zAGGtLgp4nmnKVGdPeiw'
  )
  const [items, setItems] = useState()

  // Use an effect hook to subscribe to the item stream and
  // automatically unsubscribe when the component unmounts.
  useEffect(() => {
    const unsubscribe = FirestoreService.streamItems(
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
    return unsubscribe
  }, [groupId, setItems])

  return (
    <React.Fragment>
      <h1>Inventory Page</h1>
      {items &&
        items.map((item, i) => (
          <div key={i}>{item.name}</div>
        ))}
    </React.Fragment>
  )
}

export default Inventory
