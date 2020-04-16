import React, { useState, useEffect } from 'react'
import AddItemToGroup from '../forms/AddItemToGroup'
import ItemsList from './ItemsList'
import { bool, array, object } from 'prop-types'

// Firebase/firestore.
import * as FirestoreService from '../../firestore'

function Inventory(props) {
  const { groups, groupIds } = props;
  // Inventory.
  const [items, setItems] = useState([])

  // Form.
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);

  useEffect(() => {
    if (groupIds.length > 0) {
    const unsubscribe = FirestoreService.streamItems(
      groupIds,
      {
        next: (querySnapshot) => {
          const item = querySnapshot.docs.map(
            (docSnapshot) => {
              let item = docSnapshot.data();
              item['id'] = docSnapshot.id;

              return item;
            }
          )
          setItems(item)
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
      <div className='flex flex-row justify-evenly'>
        <section className='flex flex-col'>
          <h2>Your Inventory</h2>
          {items.length > 0
          ? (<ItemsList items={items} {...props} />)
          : (<div>Loading...</div>)
          }
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
