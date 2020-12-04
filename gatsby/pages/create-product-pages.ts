import { CreatePagesArgs } from 'gatsby'
import path from 'path'

interface IProducts {
  allShopifyProduct: {
    edges: [
      {
        node: {
          handle: string
        }
      }
    ]
  }
}

export default async function createProductPages({
  graphql,
  actions,
  reporter,
}: CreatePagesArgs): Promise<void> {
  const { createPage } = actions
  const result = await graphql<IProducts>(`
    {
      allShopifyProduct {
        edges {
          node {
            handle
          }
        }
      }
    }
  `)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const shopifyProducts = result?.data?.allShopifyProduct.edges
  shopifyProducts?.forEach(({ node }) => {
    createPage({
      path: `/product/${node.handle}/`,
      component: path.resolve(`./src/templates/ProductPage/index.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        handle: node.handle,
      },
    })
  })
}
