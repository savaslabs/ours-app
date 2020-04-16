import React from 'react'

function ItemCard({ item }) {
  return (
    <article>
      <h1>{item.name}</h1>
      <dl>
        <dt>Cost</dt>
        <dd>{item.cost}</dd>
      </dl>
    </article>
  )
}

export default ItemCard
