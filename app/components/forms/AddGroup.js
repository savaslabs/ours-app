import React, { useState } from 'react'

function AddGroup () {
  const group = {
    name: '',
    items: [],
    coOwners: [],
  }

  const blankItem = {
    item_name: '',
    image: '',
    cost: '',
    paidOff: null,
    endDate: '',
    primaryFunder: ''
  }

  const blankCoOwner = {
    first_name: '',
    email: ''
  }

  const [items, setItems] = useState([{ ...blankItem }])
  const [coOwners, setCoOwners] = useState([{ ...blankCoOwner }])

  const addItem = () => {
    setItems([...items, { ...blankItem }])
  }
  const addCoOwner = () => {
    setCoOwners([...coOwners, { ...blankCoOwner }])
  }

  // Dynamically set state when new item is added.
  const handleNewItem = e => {
    const updatedItems = [...items]
    updatedItems[e.target.dataset.idx][e.target.className] = e.target.value
    setItems(updatedItems)
  }

  // Dynamically set state when new co-owner is added.
  const handleNewCoOwner = e => {
    const updatedCoOwners = [...coOwners]
    updatedCoOwners[e.target.dataset.idx][e.target.className] = e.target.value
    setCoOwners(updatedCoOwners)
  }

  return (
    <React.Fragment>
      <form>
        <label html-for='group-name'>Group Name</label>
        <input id='group-name' type='text' name='textfield' />
        <label html-for='email'>Co-owners</label>
        {coOwners.map((value, idx) => {
          return (
            <React.Fragment key={idx}>
              <input
                type='text'
                className='first_name'
                value={coOwners[idx].first_name}
                data-idx={idx}
                name='first_name'
                onChange={handleNewCoOwner}
              />
              <input
                type='email'
                data-idx={idx}
                name='email'
                value={coOwners[idx].email}
                className='email'
                onChange={handleNewCoOwner}
              />
            </React.Fragment>
          )
        })}
        <input
          type='button'
          value='Add Another Co-Owner'
          onClick={addCoOwner}
        />

        <fieldset>
          <legend>Add Items</legend>
          {items.map((value, idx) => {
            return (
              <React.Fragment key={idx}>
                <label html-for='item_name'>Item</label>
                <input
                  type='text'
                  name='item_name'
                  value={items[idx].item_name}
                  data-idx={idx}
                  className='item_name'
                  onChange={handleNewItem}
                />
                <label html-for='image'>Upload Image</label>
                <input
                  type='file'
                  name='image'
                  value={items[idx].image}
                  data-idx={idx}
                  className='image'
                  onChange={handleNewItem}
                />
                <label html-for='cost'>Cost of item</label>
                <input
                  type='text'
                  inputMode='numeric'
                  pattern='[0-9]*'
                  name='cost'
                  value={items[idx].cost}
                  data-idx={idx}
                  className='cost'
                  onChange={handleNewItem}
                />
                <fieldset>
                  <legend>Is this item fully paid for?</legend>
                  <input type='radio' id='yes' name='paid' value='yes' />
                  <label html-for='yes'>Yes</label>
                  <input type='radio' id='no' name='paid' value='no' />
                  <label html-for='no'>No</label>
                  <label>Is there a primary funder?</label>
                  <select name='primaryFunder'>
                    <option value=''>--Select an Option--</option>
                    {coOwners.map((value, index) => {
                      return (
                        <option
                          key={index}
                          data-idx={idx}
                          className='primaryFunder'
                          value={items[idx].primaryFunder}
                          onChange={handleNewItem}
                        >
                          {coOwners[index].first_name}
                        </option>
                      )
                    })}
                  </select>
                </fieldset>
              </React.Fragment>
            )
          })}

          <input
            type='button'
            value='Add Another Item'
            onClick={addItem}
          />
        </fieldset>
        {coOwners.length &&
          coOwners.map((value, idx) => {
            return (
              <fieldset key={idx}>
                <legend>{coOwners[idx].first_name}</legend>
                <label>Payment Amount</label>
                <input type='text' inputMode='numeric' pattern='[0-9]*' />
                <label>Payment Frequency</label>
                <input type='date' />
              </fieldset>
            )
          })}
        <input type='submit' name='submit' />
      </form>
    </React.Fragment>
  )
}

export default AddGroup;
