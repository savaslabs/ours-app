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
    <main>
      <h1>Community Page</h1>
      <div className='flex flex-row'>
        <div className='flex-col'>
          {associatedGroups &&
            associatedGroups.map((group, i) => (
              <article key={i} className='rounded shadow'>
                <h1>Group: {group.groupName}</h1>
                <ul>
                  Members:{' '}
                  {group.coOwners.map((users, index) => {
                    return <li key={index}>{users}</li>
                  })}
                </ul>
              </article>
            ))}
        </div>
        <AddGroupForm />
      </div>
    </main>
  )
}

export default Community
