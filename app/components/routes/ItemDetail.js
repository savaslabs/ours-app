import React from 'react'

function ItemDetail(props) {
  return (
    <main>
      <h1>Item #{props.match.params.itemId}</h1>
    </main>
  )
}

export default ItemDetail
