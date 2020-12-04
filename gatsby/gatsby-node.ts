import { GatsbyNode } from 'gatsby'
import createProductPages from './pages/create-product-pages'

export const createPages: GatsbyNode['createPages'] = async gatsbyNode => {
  await createProductPages(gatsbyNode)
}
