import React, { useState, useEffect } from 'react'
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet'
import aphroditeInterface from 'react-with-styles-interface-aphrodite'
import DefaultTheme from 'react-dates/lib/theme/DefaultTheme'

ThemedStyleSheet.registerInterface(aphroditeInterface)
ThemedStyleSheet.registerTheme(DefaultTheme)

import { DayPickerRangeController } from 'react-dates';
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

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [focusedInput, setFocusedInput] = useState('startDate')

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
      <DayPickerRangeController
        startDate={startDate}
        endDate={endDate}
        onDatesChange={({ startDate, endDate }) => {
          setStartDate(startDate)
          setEndDate(endDate)
        }}
        focusedInput={focusedInput}
        onFocusChange={focusedInput => setFocusedInput(focusedInput)}
      />
    </main>
  )
}

export default Inventory
