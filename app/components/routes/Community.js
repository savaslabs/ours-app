import React, { useContext } from 'react'
import GroupCard from './GroupCard'
import AddGroupForm from '../forms/AddGroup'
import { AuthContext } from '../../App'

function Community() {

  const { currentUser, groups } = useContext(AuthContext)

  return (
    <main>
      <h1>Community Page</h1>
      <div className='flex flex-row w-full justify-evenly'>
        <div className='flex flex-col'>
          {groups &&
            groups.map((group, i) => (
              <GroupCard key={i} group={group} />
            ))}
        </div>
        <AddGroupForm currentUser={currentUser} />
      </div>
    </main>
  )
}

export default Community
