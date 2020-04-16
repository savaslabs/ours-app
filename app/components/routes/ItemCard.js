import React from 'react'
import { withRouter } from 'react-router-dom'

function ItemCard(props) {

  const toItemDetail = e => {
    let path = `/inventory/${props.item.id}`
    props.history.push(path)
  }
  return (
    <article>
      <h1 onClick={toItemDetail}>{props.item.name}</h1>
      <dl>
        <dt>Cost</dt>
        <dd>{props.item.cost}</dd>
      </dl>
    </article>
  )
}

export default withRouter(ItemCard)
