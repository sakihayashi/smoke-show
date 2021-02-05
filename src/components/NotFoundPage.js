import React from 'react'
import {Helmet} from "react-helmet"
import Layout from './Layout/Layout'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
      <Layout>
      <Helmet>
          <meta charSet="utf-8" />
          <title>404 Page Not Found | The Smoke Show</title>
          <meta name="description" content="The page does not exist at thesmokeshow.com. " />
          <meta name="robots" content="noindex, nofollow" />
          {/* <link rel="canonical" href="http://mysite.com/example" /> */}
      </Helmet>
        <div className="spacer-4rem"></div>
        <div className="not-found-wrapper">
            <h1 className="not-found">404 Page Not Found</h1>
            <Link to="/">
            <div className="go-home">Go back to Home</div>
            </Link>
        </div>
      </Layout>
  )
}

export default NotFoundPage