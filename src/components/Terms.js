import React from 'react'
import {Helmet} from "react-helmet"
import Layout from './Layout/Layout'
import loadable from '@loadable/component'
import './terms.scss'

const TermsTxt = loadable(() => import('./TermsTxt'))


const Terms = () =>{
    return(
        <Layout>
            <Helmet>
                <title>Terms and conditions | The Smoke Show</title>
            </Helmet>
            <div className="spacer-4rem"></div>
            <div className="main-wrapper" style={{minHeight: 'calc(100vh - 21rem)'}}>
                <center>
                    <h1 className="theme-text-color theme-text-p">Terms of Use</h1>
                    
                </center>
                <div className="spacer-2rem"></div>
                <TermsTxt />
            </div>
        </Layout>
    )
}

export default Terms