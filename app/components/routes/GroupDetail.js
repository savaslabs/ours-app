import React, { useContext, useState, useEffect } from 'react'
import _find from 'lodash.find'
import { AuthContext } from '../../App'
import * as FirestoreService from '../../firestore'

function GroupDetail(props) {
  const { groups } = useContext(AuthContext)
  const [groupItems, setGroupItems] = useState([])

  const group = _find(groups, {
    id: props.match.params.groupId
  })

  useEffect(() => {
    const unsubscribe = FirestoreService.streamItems(props.match.params.groupId, {
      next: (querySnapshot) => {
        const item = querySnapshot.docs.map((docSnapshot) => {
          let item = docSnapshot.data()
          item['id'] = docSnapshot.id

          return item
        })
        setGroupItems(item)
      }
    })
    return unsubscribe
  }, [props, setGroupItems])

  function fetchGroupItems() {
    return groupItems.length > 0
    ? groupItems.map((item, idx) => {
        <li key={idx}>
          <dl>
            {item.name}
            <dt>Cost</dt>
            <dd>{item.cost}</dd>
            <dt>Is Item Paid Off?</dt>
            <dd>{item.paidOff}</dd>
            <dt>Payment Due</dt>
            <dd>{item.endDate}</dd>
            <dt>Primary Funder</dt>
            <dd>{item.primaryFunder}</dd>
          </dl>
        </li>
      })
    : <div>Loading...</div>
  }

  useEffect(() => {
    fetchGroupItems()
  }, [groupItems])

  return (
    <main>
      <h1>{group.groupName}</h1>
      <ul>Members
        {group.coOwners.map((coOwner, index) => {
          return (
            <li key={index}>{coOwner}</li>
          )
        })}
      </ul>
      <ul>Group Items
        {fetchGroupItems()}
      </ul>
    </main>
  )
}

export default GroupDetail
