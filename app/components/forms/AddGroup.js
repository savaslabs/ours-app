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
        <fieldset>
          <label html-for='group-name'>Group Name</label>
          <input id='group-name' type='text' name='textfield'></input>
          <label html-for='co-owners'>Co-owners</label>

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
              ></input>
            )
          })}
          <input
            type='button'
            value='Add Another Co-Owner'
            onClick={addEmail}
          />
        </fieldset>
      </form>
    </React.Fragment>
  )
}

export default AddGroup;
