import 'isomorphic-fetch'
import React, { useState, useEffect, FC } from 'react'
import Client from 'shopify-buy'

import Context from '~context/StoreContext'

const client = Client.buildClient({
  storefrontAccessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
  domain: `${process.env.SHOP_NAME}.myshopify.com`,
})

interface IProps {
  children: React.ReactNode
}

interface IStoreState {
  client: Client.Client
  adding: boolean
  checkout: Client.Cart
  products: Client.Product[]
  shop: unknown
}

const ContextProvider: FC<IProps> = ({ children }) => {
  const initialStoreState: IStoreState = {
    client,
    adding: false,
    checkout: {
      id: '',
      checkoutUrl: '',
      lineItemCount: 0,
      lineItems: [],
      subtotalPrice: '',
      completedAt: null,
    },
    products: [],
    shop: {},
  }
  const [store, updateStore] = useState(initialStoreState)
  let isRemoved = false

  useEffect(() => {
    const initializeCheckout = async () => {
      // Check for an existing cart.
      const isBrowser = typeof window !== 'undefined'
      const existingCheckoutID = isBrowser
        ? localStorage.getItem('shopify_checkout_id')
        : null

      const setCheckoutInState = (checkout: Client.Cart) => {
        if (isBrowser) {
          localStorage.setItem('shopify_checkout_id', String(checkout.id))
        }

        updateStore(prevState => {
          return { ...prevState, checkout }
        })
      }

      const createNewCheckout = () => store.client.checkout.create()
      const fetchCheckout = (id: string) => store.client.checkout.fetch(id)

      if (existingCheckoutID) {
        try {
          const checkout = await fetchCheckout(existingCheckoutID)
          // Make sure this cart hasn’t already been purchased.
          if (!isRemoved && !checkout.completedAt) {
            setCheckoutInState(checkout)
            return
          }
        } catch (e) {
          localStorage.setItem('shopify_checkout_id', '')
        }
      }

      const newCheckout = await createNewCheckout()
      if (!isRemoved) {
        setCheckoutInState(newCheckout)
      }
    }

    initializeCheckout()
  }, [store.client.checkout])

  useEffect(
    () => () => {
      isRemoved = true
    },
    []
  )

  return (
    <Context.Provider
      value={{
        store,
        addVariantToCart: (variantId: string, quantity: number) => {
          if (variantId === '' || !quantity) {
            console.error('Both a size and quantity are required.')
            return
          }

          updateStore(prevState => {
            return { ...prevState, adding: true }
          })

          const { checkout, client } = store

          const checkoutId = checkout.id
          const lineItemsToUpdate = [{ variantId, quantity }]

          return client.checkout
            .addLineItems(checkoutId, lineItemsToUpdate)
            .then(checkout => {
              updateStore(prevState => {
                return { ...prevState, checkout, adding: false }
              })
            })
        },
        removeLineItem: (
          client: Client.Client,
          checkoutID: string | number,
          lineItemID: string
        ) => {
          return client.checkout
            .removeLineItems(checkoutID, [lineItemID])
            .then(res => {
              updateStore(prevState => {
                return { ...prevState, checkout: res }
              })
            })
        },
        updateLineItem: (
          client: Client.Client,
          checkoutID: string | number,
          lineItemID: string,
          quantity: number
        ) => {
          const lineItemsToUpdate = [{ id: lineItemID, quantity: quantity }]

          return client.checkout
            .updateLineItem(checkoutID, lineItemsToUpdate)
            .then(res => {
              updateStore(prevState => {
                return { ...prevState, checkout: res }
              })
            })
        },
      }}
    >
      {children}
    </Context.Provider>
  )
}
export default ContextProvider
