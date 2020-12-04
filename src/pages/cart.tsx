import React, { FC } from 'react'

import Cart from '~components/Cart'
import { Container } from '~utils/styles'

const CartPage: FC = () => (
  <Container>
    <h1>Cart</h1>
    <Cart />
  </Container>
)

export default CartPage
