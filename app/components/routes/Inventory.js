import React, { useState, useEffect } from 'react'
import AddItemToGroup from '../forms/AddItemToGroup'
import ItemsList from './ItemsList'
import { bool, array, object } from 'prop-types'

// React-Date.
import { DayPickerRangeController } from 'react-dates'
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet'
import aphroditeInterface from 'react-with-styles-interface-aphrodite'
import DefaultTheme from 'react-dates/lib/theme/DefaultTheme'
ThemedStyleSheet.registerInterface(aphroditeInterface)
ThemedStyleSheet.registerTheme(DefaultTheme)

// Firebase/firestore.
import * as FirestoreService from '../../firestore'

function Inventory(props) {
  const { groups, groupIds } = props;
  // Inventory.
  const [items, setItems] = useState([])

  // Form.
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);

  // Date picker.
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [focusedInput, setFocusedInput] = useState('startDate')

  useEffect(() => {
    if (groupIds.length > 0) {
    const unsubscribe = FirestoreService.streamItems(
      groupIds,
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
    } else {
      console.log('props havent loaded yet')
    }
  }, [groupIds, setItems])

  const toggleForm = e => {
    setIsAddFormVisible(!isAddFormVisible);
  }

  return (
    <main>
      <h1>Inventory Page</h1>
      <div className='container flex flex-row justify-evenly'>
        <section className='flex flex-col'>
          <h2>Your Inventory</h2>
          {items.length > 0
          ? (<ItemsList items={items} {...props} />)
          : (<div>Loading...</div>)
          }
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

Inventory.propTypes = {
  isLoggedIn: bool,
  groups: array,
  groupIds: array,
  props: object
}

export default Inventory
