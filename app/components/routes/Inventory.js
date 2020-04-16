import React, { useState, useEffect } from 'react'
import AddItemToGroup from '../forms/AddItemToGroup'

// React-Date.
import { DayPickerRangeController } from 'react-dates'
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet'
import aphroditeInterface from 'react-with-styles-interface-aphrodite'
import DefaultTheme from 'react-dates/lib/theme/DefaultTheme'
ThemedStyleSheet.registerInterface(aphroditeInterface)
ThemedStyleSheet.registerTheme(DefaultTheme)

// Firebase/firestore.
import * as FirestoreService from '../../firestore'
import * as firebase from 'firebase/app'

function Inventory() {
  const [currentUser, setCurrentUser] = useState(
    firebase.auth().currentUser.uid
  )

  // Inventory.
  const [groupIds, setGroupIds] = useState([])
  const [groups, setGroups] = useState([])
  const [items, setItems] = useState([])

  // Form.
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);

  // Date picker.
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

        const updatedGroups = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        )
        setGroups(updatedGroups);
        setGroupIds(updatedGroupIds)
      }
    })
    return unsubscribe
  }, [currentUser, setGroupIds])


  useEffect(() => {
    async function fetchItems() {
      const ids = await groupIds;
      const unsubscribe = FirestoreService.streamItems(
        ids,
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
    }
    fetchItems()
  }, [groupIds, setItems])

  const toggleForm = e => {
    setIsAddFormVisible(!isAddFormVisible);
  }

  useEffect(() => {
  }, [items])

  return (
    <main>
      <h1>Inventory Page</h1>
      <div className='container flex flex-row justify-evenly'>
        <section className='flex flex-col'>
          <h2>Your Inventory</h2>
          {items.length > 0 ? (
            items.map((item, i) => {
              return (
                <dl key={i}>
                  {Object.keys(item).map((key, i) => {
                    if (key == 'created') {
                      return null
                    } else {
                      return (
                        <React.Fragment key={i}>
                          <dt>{key}</dt>
                          <dd>{item[key]}</dd>
                        </React.Fragment>
                      )
                    }
                  })}
                </dl>
              )
            })
          ) : (
            <div>Loading...</div>
          )}
        </section>
        <section className='flex'>
          <DayPickerRangeController
            startDate={startDate}
            endDate={endDate}
            onDatesChange={({ startDate, endDate }) => {
              setStartDate(startDate)
              setEndDate(endDate)
            }}
            focusedInput={focusedInput}
            onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
          />
        </section>
        <section className='flex flex-col'>
          {groups && (
            <React.Fragment>
              <button onClick={toggleForm}>Add New Item to Group</button>
              <AddItemToGroup
                groups={groups}
                isAddFormVisible={isAddFormVisible}
              />
            </React.Fragment>
          )}
        </section>
      </div>
    </main>
  )
}

export default Inventory
