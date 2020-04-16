import React from 'react'
import ItemCard from './ItemCard'

const ItemsList = ({ items }) => {
  return items.map((item, i) => {
    return <ItemCard key={i} item={item} />
  })
}

export default ItemsList
