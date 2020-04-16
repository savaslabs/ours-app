import React, { useState, useEffect } from 'react'
import * as FirestoreService from '../../firestore'

function AddGroup (props) {
  const { currentUser } = props;
  const blankItem = {
    itemName: '',
    image: '',
    cost: '',
    paidOff: null,
    endDate: '',
    primaryFunder: ''
  }

  const blankCoOwner = {
    firstName: '',
    email: ''
  }

  const [groupName, setGroupName] = useState('')
  const [items, setItems] = useState([{ ...blankItem }])
  const [coOwners, setCoOwners] = useState([{ ...blankCoOwner }])

  const addItem = () => {
    setItems([...items, { ...blankItem }])
  }
  const addCoOwner = () => {
    setCoOwners([...coOwners, { ...blankCoOwner }])
  }

  // Dynamically set state when item or coOwner input is updated.
  const handleNewInput = (e, input) => {
    e.preventDefault()

    switch (input) {
      case 'item':
        const updatedItems = [...items]
        switch (e.target.className) {
          default:
            updatedItems[e.target.dataset.idx][e.target.className] = e.target.value
            break
          case 'image':
            updatedItems[e.target.dataset.idx][e.target.className] =
              e.target.files[0]
        }
        setItems(updatedItems)
      break;
      case 'coOwner':
        const updatedCoOwners = [...coOwners]
        updatedCoOwners[e.target.dataset.idx][e.target.className] = e.target.value
        setCoOwners(updatedCoOwners)
    }
  }

  // Update db on submit.
  const handleSubmit = e => {
    e.preventDefault();

    let userId = currentUser
    let group = groupName;

    FirestoreService.addGroup(userId, group, coOwners, items)
      .then((docRef) => {
        onCreate(docRef.id, group, coOwners, items)
      })
      .catch((reason) => console.log(reason))
  }

  return (
    <form onSubmit={handleSubmit}>
      <label html-for='groupName'>Group Name</label>
      <input
        id='groupName'
        className='groupName'
        type='text'
        value={groupName}
        onChange={e => setGroupName(e.target.value)}
        required
      />
      <label html-for='email'>Co-owners</label>
      {coOwners.map((coOwner, idx) => {
        return (
          <React.Fragment key={idx}>
            <input
              type='text'
              className='firstName'
              value={coOwners[idx].firstName || ''}
              data-idx={idx}
              name='firstName'
              onChange={e => handleNewInput(e, 'coOwner')}
              required
            />
            <input
              type='email'
              data-idx={idx}
              name='email'
              value={coOwners[idx].email || ''}
              className='email'
              onChange={e => handleNewInput(e, 'coOwner')}
              required
            />
          </React.Fragment>
        )
      })}
      <input type='button' value='Add Another Co-Owner' onClick={addCoOwner} />

      <fieldset>
        <legend>Add Items</legend>
        {items.map((item, idx) => {
          return (
            <React.Fragment key={idx}>
              <label html-for='itemName'>Item</label>
              <input
                type='text'
                name='itemName'
                value={items[idx].itemName || ''}
                data-idx={idx}
                className='itemName'
                onChange={e => handleNewInput(e, 'item')}
                required
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
                    onChange={e => handleNewInput(e, 'item')}
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
                    onChange={e => handleNewInput(e, 'item')}
                    required
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
                      onInput={e => handleNewInput(e, 'item')}
                      required
                    />
                    <label html-for='TRUE'>Yes</label>
                    <input
                      type='radio'
                      id='FALSE'
                      data-idx={idx}
                      name='paidOff'
                      className='paidOff'
                      value='FALSE'
                      onInput={e => handleNewInput(e, 'item')}
                    />
                    <label html-for='FALSE'>No</label>
                    <input
                      type='date'
                      id='endDate'
                      className='endDate'
                      data-idx={idx}
                      value={items[idx].endDate || ''}
                      onChange={e => handleNewInput(e, 'item')}
                    />
                    <label html-for='endDate'>Payment End Date</label>
                    <label>Is there a primary funder?</label>
                    <select
                      name='primaryFunder'
                      className='primaryFunder'
                      data-idx={idx}
                      onChange={e => handleNewInput(e, 'item')}
                      required
                    >
                      <option value=''>--Select an Option--</option>
                      {coOwners.map((coOwner, index) => {
                        return (
                          <option
                            key={index}
                            value={coOwners[index].firstName || ''}
                          >
                            {coOwners[index].firstName}
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
      {coOwners.length &&
        coOwners.map((coOwner, idx) => {
          return (
            <fieldset key={idx}>
              <legend>{coOwners[idx].firstName}</legend>
              {items.map((item, index) => {
                // Only show show payment schedule/amount if not primary funder.
                return items[index].primaryFunder ===
                  coOwners[idx].firstName ? null : (
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
  )
}

export default AddGroup;
