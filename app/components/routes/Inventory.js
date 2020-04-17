import React, { useState, useEffect, useContext } from 'react'
import AddItemToGroup from '../forms/AddItemToGroup'
import ItemsList from './ItemsList'
import { AuthContext } from '../../App'
import { bool, array, object } from 'prop-types'

function Inventory() {
  const { groups, allUserItems } = useContext(AuthContext)
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);

  function fetchUserItems() {
    return allUserItems
     ? <ItemsList allUserItems={allUserItems} />
     : <div>Loading...</div>
  }
  useEffect(() => { fetchUserItems()}, [allUserItems])

  const toggleForm = e => {
    setIsAddFormVisible(!isAddFormVisible);
  }

  return (
    <main>
      <h1>Inventory Page</h1>
      <div className='flex flex-row justify-evenly'>
        <section className='flex flex-col'>
          <h2>Your Inventory</h2>
          {fetchUserItems()}
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
