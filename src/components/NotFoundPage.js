import React from 'react'
import Layout from './Layout/Layout'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
      <Layout>
        <div className="spacer-4rem"></div>
        <div className="not-found-wrapper">
            <div className="not-found">404 Page Not Found</div>
            <Link to="/">
            <div className="go-home">Go back to Home</div>
            </Link>
        </div>
      </Layout>
  )
}

export default NotFoundPage