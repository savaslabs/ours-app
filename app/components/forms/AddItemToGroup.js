import React, { useState, useEffect } from 'react'
import * as FirestoreService from '../../firestore'
import firebase from 'firebase/app'

function AddItemToGroup(props) {
  const { isAddFormVisible, groups } = props

  const blankItem = {
    itemName: '',
    image: '',
    cost: '',
    paidOff: null,
    endDate: '',
    primaryFunder: ''
  }

  const [selectedGroup, setSelectedGroup] = useState('')
  const [coOwners, setCoOwners] = useState()
  const [items, setItems] = useState([{ ...blankItem }])

  const addItem = () => {
    setItems([...items, { ...blankItem }])
  }

  useEffect(() => {
    if (selectedGroup.length > 1) {
      const selection = groups.filter(group => {
        return group.groupName === selectedGroup
      })

      setCoOwners(selection[0]['coOwners']);
    }

    // setCoOwners(selection[0].coOwners)
  }, [selectedGroup, setCoOwners])

  // Dynamically set state when item or coOwner input is updated.
  const handleNewInput = e => {
    e.preventDefault()

    const updatedItems = [...items]
    switch (e.target.className) {
      default:
        updatedItems[e.target.dataset.idx][e.target.className] =
          e.target.value
        break
      case 'image':
        updatedItems[e.target.dataset.idx][e.target.className] =
          e.target.files[0]
    }
    setItems(updatedItems)
  }

  // Update db on submit.
  const handleSubmit = e => {
    e.preventDefault()

    let user = firebase.auth().currentUser
    let userId = user.uid

    FirestoreService.addItemToGroup(items, selectedGroup, userId)
      .then((docRef) => {
        onCreate(docRef.id, items, selectedGroup, userId)
      })
      .catch((reason) => console.log(reason))
  }

  return isAddFormVisible ? (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Add Items</legend>
        {items.map((item, idx) => {
          return (
            <React.Fragment key={idx}>
              <label>Which group would you like to add this item to?</label>
              <select
                name='group'
                className='group'
                data-idx={idx}
                onChange={e => setSelectedGroup(e.target.value)}
              >
                <option value=''>--Select a Group--</option>
                {groups && groups.map((group, index) => {
                  return (
                    <option key={index} value={groups[index].groupName || ''}>
                      {groups[index].groupName}
                    </option>
                  )
                })}
              </select>
              <label html-for='itemName'>Item</label>
              <input
                type='text'
                name='itemName'
                value={items[idx].itemName || ''}
                data-idx={idx}
                className='itemName'
                onChange={handleNewInput}
              />
              {/* Wait to render additional item inputs until item name has been added.  */}
              {items[idx].itemName && (
                <React.Fragment>
                  <label html-for='image'>Upload Image</label>
                  <input
                    type='file'
                    name='image'
                    data-idx={idx}
                    className='image'
                    onChange={handleNewInput}
                  />
                  <label html-for='cost'>Cost of item</label>
                  <input
                    type='text'
                    inputMode='numeric'
                    pattern='[0-9]*'
                    name='cost'
                    value={items[idx].cost || ''}
                    data-idx={idx}
                    className='cost'
                    onChange={(e) => handleNewInput(e, 'item')}
                  />
                  <fieldset>
                    <legend>Is this item fully paid for?</legend>
                    <input
                      type='radio'
                      id='TRUE'
                      data-idx={idx}
                      name='paidOff'
                      className='paidOff'
                      value='TRUE'
                      onInput={handleNewInput}
                    />
                    <label html-for='TRUE'>Yes</label>
                    <input
                      type='radio'
                      id='FALSE'
                      data-idx={idx}
                      name='paidOff'
                      className='paidOff'
                      value='FALSE'
                      onInput={handleNewInput}
                    />
                    <label html-for='FALSE'>No</label>
                    <input
                      type='date'
                      id='endDate'
                      className='endDate'
                      data-idx={idx}
                      value={items[idx].endDate || ''}
                      onChange={handleNewInput}
                    />
                    <label html-for='endDate'>Payment End Date</label>
                    <label>Is there a primary funder?</label>
                    <select
                      name='primaryFunder'
                      className='primaryFunder'
                      data-idx={idx}
                      onChange={handleNewInput}
                    >
                      <option value=''>--Select an Option--</option>
                      {coOwners && coOwners.map((coOwner, index) => {
                        return (
                          <option
                            key={index}
                            value={coOwner || ''}
                          >
                            {coOwner}
                          </option>
                        )
                      })}
                    </select>
                  </fieldset>
                </React.Fragment>
              )}
            </React.Fragment>
          )
        })}

        <input type='button' value='Add Another Item' onClick={addItem} />
      </fieldset>
      {coOwners &&
        coOwners.map((coOwner, idx) => {
          return (
            <fieldset key={idx}>
              <legend>{coOwner}</legend>
              {items && items.map((item, index) => {
                // Only show show payment schedule/amount if not primary funder.
                return items[index].primaryFunder ===
                  coOwner ? null : (
                  <React.Fragment key={index}>
                    <p>{items[index].itemName}</p>
                    <label>Payment Amount</label>
                    <input type='text' inputMode='numeric' pattern='[0-9]*' />
                    <label>Payment Frequency</label>
                    <input type='date' />
                  </React.Fragment>
                )
              })}
            </fieldset>
          )
        })}
      <input type='submit' name='submit' />
    </form>
  ) : null;
}

export default AddItemToGroup
