import React from 'react'
import _find from 'lodash.find'

function GroupDetail(props) {
  console.log('GroupDetail props', props)

  const group = _find(props.groups, {
    id: parseInt(props.match.params.groupId, 10)
  })

  console.log('group', group);

  return (
    <main>
      <h1>Group Detail Page</h1>
    </main>
  )
}

export default GroupDetail
