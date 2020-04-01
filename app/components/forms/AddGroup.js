import React, { useState } from 'react'

function AddGroup () {
  const blankEmail = { email: '' }
  const [emails, setEmails] = useState([{ ...blankEmail }])

  const addEmail = () => {
    setEmails([...emails, { ...blankEmail }])
  }

  // Dynamically set state when new email address is added by user.
  const handleNewEmail = e => {
    const updatedEmails = [...emails]
    updatedEmails[e.target.dataset.idx][e.target.className] = e.target.value
    setEmails(updatedEmails)
  }

  return (
    <React.Fragment>
      <form>
        <label html-for='group-name'>Group Name</label>
        <input id='group-name' type='text' name='textfield' />
        <fieldset>
          <legend>Add Items</legend>
          <label html-for='item-name'>Item</label>
          <input type='text' name='item-name' />
          <label html-for='image'>Upload Image</label>
          <input type='file' name='image' />
          <label html-for='cost'>Cost of item</label>
          <input type='numeric' name='cost' />
          <fieldset>
            <legend>Is this item fully paid for?</legend>
            <input type='radio' id='yes' name='paid' value='yes' />
            <label html-for='yes'>Yes</label>
            <input type='radio' id='no' name='paid' value='no' />
            <label html-for='no'>No</label>
          </fieldset>
        </fieldset>
        <label html-for='email'>Co-owners</label>

        {emails.map((value, idx) => {
          return (
            <input
              type='email'
              key={idx}
              data-idx={idx}
              name='email'
              value={emails[idx].email}
              className='email'
              onChange={handleNewEmail}
            />
          )
        })}
        <input type='button' value='Add Another Co-Owner' onClick={addEmail} />

        <input type='submit' name='submit' />
      </form>
    </React.Fragment>
  )
}

export default AddGroup;
