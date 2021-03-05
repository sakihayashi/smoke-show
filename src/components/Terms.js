import React from 'react'
import {Helmet} from "react-helmet"
import Layout from './Layout/Layout'

const Terms = () =>{
    return(
        <Layout>
            <Helmet>
                <title>Terms and conditions | The Smoke Show</title>
            </Helmet>
            <div className="spacer-4rem"></div>
            <div className="main-wrapper" style={{minHeight: 'calc(100vh - 21rem)'}}>
                <center>
                    <h4 className="theme-text-color">Terms and conditions</h4>
                    <img src="https://s3.amazonaws.com/smokeshow.users/6033f80f38f47a90d9a95dd4/profile/pic300" />
                </center>
                
                <div className="terms-wrapper">
                    <p>

                    </p>
                </div>
            </div>
        </Layout>
    )
}

export default Terms