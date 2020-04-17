import React from 'react'
import GroupCard from './GroupCard'
import AddGroupForm from '../forms/AddGroup'

function Community(props) {
  const { currentUser, groups } = props;

  return (
    <main>
      <h1>Community Page</h1>
      <div className='flex flex-row w-full justify-evenly'>
        <div className='flex flex-col'>
          {groups &&
            groups.map((group, i) => (
              <GroupCard key={i} {...props} group={group} />
            ))}
        </div>
        <AddGroupForm currentUser={currentUser} />
      </div>
    </main>
  )
}

export default Community
