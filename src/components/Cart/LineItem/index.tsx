import React, { FC, useContext } from 'react'
import { Link } from 'gatsby'

import StoreContext from '~context/StoreContext'
import { Wrapper } from './styles'

interface IProps {
  item: {
    id: string
    title: string
    quantity: number
    variant: {
      title: string
      product: {
        handle: string
      }
      image?: {
        src: string
      }
      selectedOptions: [
        {
          name: string
          value: string
        }
      ]
    }
  }
}

const LineItem: FC<IProps> = props => {
  const { item } = props
  const {
    removeLineItem,
    store: { client, checkout },
  } = useContext(StoreContext)

  const variantImage = item.variant.image ? (
    <img
      src={item.variant.image.src}
      alt={`${item.title} product shot`}
      height="60px"
    />
  ) : null

  const selectedOptions = item.variant.selectedOptions
    ? item.variant.selectedOptions.map(
        option => `${option.name}: ${option.value} `
      )
    : null

  const handleRemove = () => {
    removeLineItem(client, checkout.id, item.id)
  }

  return (
    <Wrapper>
      {console.log(item)}
      <Link to={`/product/${item.variant.product.handle}/`}>
        {variantImage}
      </Link>
      <p>
        {item.title}
        {`  `}
        {item.variant.title !== 'Default Title' ? item.variant.title : ''}
      </p>
      {selectedOptions}
      {item.quantity}
      <button onClick={handleRemove}>Remove</button>
    </Wrapper>
  )
}

export default LineItem
