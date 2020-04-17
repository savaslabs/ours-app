import React from 'react'
import ItemCard from './ItemCard'

const ItemsList = ({ allUserItems }) => {
  return allUserItems.map((item, i) => {
    return <ItemCard key={i} item={item} />
  })
}

export default ItemsList
