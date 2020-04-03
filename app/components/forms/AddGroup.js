import React, { useState } from 'react'

function AddGroup () {
  const group = {
    name: '',
    items: [],
    coOwners: [],
  }

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
        {coOwners.map((coOwner, idx) => {
          return (
            <React.Fragment key={idx}>
              <input
                type='text'
                className='firstName'
                value={coOwners[idx].first_name}
                data-idx={idx}
                name='firstName'
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
          {items.map((item, idx) => {
            return (
              <React.Fragment key={idx}>
                <label html-for='itemName'>Item</label>
                <input
                  type='text'
                  name='itemName'
                  value={items[idx].item_name}
                  data-idx={idx}
                  className='itemName'
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
                  <select
                    name='primaryFunder'
                    className='primaryFunder'
                    data-idx={idx}
                    onChange={handleNewItem}
                  >
                    <option value=''>--Select an Option--</option>
                    {coOwners.map((coOwner, index) => {
                      return (
                        <option
                          key={index}
                          value={coOwners[index].firstName}
                        >
                          {coOwners[index].firstName}
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
          coOwners.map((coOwner, idx) => {
            return (
              <fieldset key={idx}>
                <legend>{coOwners[idx].firstName}</legend>
                {items.map((item, index) => {
                  return items[index].primaryFunder === coOwners[idx].firstName ? null :
                  (
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
    </React.Fragment>
  )
}

export default AddGroup;
