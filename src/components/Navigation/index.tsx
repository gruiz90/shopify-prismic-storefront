import React, { FC, useContext } from 'react'
import reduce from 'lodash/reduce'

import StoreContext from '~context/StoreContext'
import { CartCounter, Container, MenuLink, Wrapper } from './styles'

const useQuantity = () => {
  const {
    store: { checkout },
  } = useContext(StoreContext)
  const items = checkout ? checkout.lineItems : []
  const total = reduce(items, (acc, item) => acc + item.quantity, 0)
  return [total !== 0, total]
}

interface IProps {
  siteTitle: string
}

const Navigation: FC<IProps> = ({ siteTitle = '' }) => {
  const [hasItems, quantity] = useQuantity()

  return (
    <Wrapper>
      <Container>
        <MenuLink to="/">{siteTitle}</MenuLink>
        <MenuLink to="/cart">
          {hasItems && <CartCounter>{quantity}</CartCounter>}
          Cart 🛍
        </MenuLink>
      </Container>
    </Wrapper>
  )
}

export default Navigation
