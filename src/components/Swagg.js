import React, { useEffect, useState } from 'react'
import {Helmet} from "react-helmet"
import Layout from './Layout/Layout'
import Client from 'shopify-buy';
import Products from './Shopify/Products'
import Cart from './Shopify/Cart'
import './Shopify/shopify.scss'
import Logo from '../assets/global/Logo-smoke-show.png'

const Swagg = () =>{
const [isCartOpen, setIsCartOpen] = useState(false)
const [checkout, setCheckout] = useState({ lineItems: [] })
const [products, setProducts] =useState([])
const [shop, setShop] = useState({})

const client = Client.buildClient({
    storefrontAccessToken: process.env.REACT_APP_SHOPIFY_TOKEN,
        domain: 'thehoongroup.myshopify.com',
    });

const fetchData = () =>{
    client.checkout.create().then((res) => {
        console.log('cart', res)
        setCheckout(res)
      })

      client.product.fetchAll().then((res) => {
        console.log('product', res)
        setProducts(res)
      })
  
      client.shop.fetchInfo().then((res) => {
        console.log('shop', res)
        setShop(res)
      });
}
const addVariantToCart = async (variantId, quantity)=>{
    setIsCartOpen(true)

    const lineItemsToAdd = [{variantId, quantity: parseInt(quantity, 10)}]
    // const checkoutId = checkout.id

    return await client.checkout.addLineItems(checkout.id, lineItemsToAdd).then(res => {
      console.log('res', res)
      setCheckout(res)
    });
}
const updateQuantityInCart = async (lineItemId, quantity) =>{
    // const checkoutId = checkout.id
    const lineItemsToUpdate = [{id: lineItemId, quantity: parseInt(quantity, 10)}]

    return await client.checkout.updateLineItems(checkout.id, lineItemsToUpdate).then(res => {
        setCheckout(res)
    });
}
const removeLineItemInCart = async (lineItemId) =>{
    return await client.checkout.removeLineItems(checkout.id, [lineItemId]).then(res => {
        setCheckout(res)
    });
}

const handleCartClose = () =>{
    setIsCartOpen(false)
}

useEffect(() => {
    fetchData()
}, [])
    return(
        <Layout>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Swagg | The Smoke Show</title>
            <meta name="description" content="Check out our swaggs here!" />
            {/* <link rel="canonical" href="http://mysite.com/example" /> */}
        </Helmet>
            <div className="main-wrapper">
                <div className="spacer-4rem"></div>
                <h2 className="title">Swagg</h2>
                {/* <div className="swagg-wrapper">
                </div> */}
                <div className="App">
        <div className="App__header">
          {!isCartOpen &&
            <div className="App__view-cart-wrapper">
              <button className="App__view-cart" onClick={()=> setIsCartOpen(true)}>Cart</button>
            </div>
          }
          <div className="App__title">
            {/* <h1>{shop.name}</h1> */}
            <img className="logo-header" src={Logo} alt="The Smoke Show logo"/>
            <h2>{shop.description}</h2>
          </div>
        </div>
        <div className="spacer-4rem"></div>
        <Products
          products={products}
          client={client}
          addVariantToCart={addVariantToCart}
        />
        <Cart
          checkout={checkout}
          isCartOpen={isCartOpen}
          handleCartClose={handleCartClose}
          updateQuantityInCart={updateQuantityInCart}
          removeLineItemInCart={removeLineItemInCart}
        />
      </div>
            </div>
        </Layout>
    )
}

export default Swagg