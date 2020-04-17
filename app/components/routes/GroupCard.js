import React from 'react'
import { withRouter } from 'react-router-dom'

function GroupCard(props) {
  const { group } = props;

  const toGroupDetail = (e) => {
    let path = `/community/${group.id}`
    props.history.push(path)
  }
  return (
    <article>
      <h1 onClick={toGroupDetail}>{group.groupName}</h1>
        <ul>
          Members:{' '}
          {group.coOwners.map((users, index) => {
            return <li key={index}>{users}</li>
          })}
        </ul>
      </article>
  )
}

export default withRouter(GroupCard)
