import React, { useState, useEffect } from 'react'
import AddGroupForm from '../forms/AddGroup'

function Community(props) {
  const { currentUser, groups } = props;

  return (
    <main>
      <h1>Community Page</h1>
      <div className='flex flex-row'>
        <div className='flex-col'>
          {groups &&
            groups.map((group, i) => (
              <article key={i} className='rounded shadow'>
                <h1>Group: {group.groupName}</h1>
                <ul>
                  Members:{' '}
                  {group.coOwners.map((users, index) => {
                    return <li key={index}>{users}</li>
                  })}
                </ul>
              </article>
            ))}
        </div>
        <AddGroupForm currentUser={currentUser} />
      </div>
    </main>
  )
}

export default Community
