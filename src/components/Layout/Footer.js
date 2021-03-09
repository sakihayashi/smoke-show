import React, { useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import './footer.scss'
import Logo from '../../assets/global/smokeshow-logo-black.png'

const Footer = () =>{
    const getYear = () =>{
        return new Date().getFullYear();
    }


    useEffect(() => {
        // const script = document.createElement('script');
        // const script1 = document.createElement('script');
        // script.type = "text/javascript"
        // script.src='//whugesto.net/afu.php?zoneid=4034619'
        // script1.type = "text/javascript"
        // script.text = `(function(s,u,z,p){s.src=u,s.setAttribute('data-zone',z),p.appendChild(s);})(document.createElement('script'),'//whugesto.net/afu.php?zoneid=4034619',4034420,document.body || Cdocument.documentElement)`
        // document.body.appendChild(script);
        // document.body.appendChild(script1);
      
        // return () => {
        //   document.body.removeChild(script);
        //   document.body.removeChild(script);
        // }
      }, []);
    return(
        <Fragment>
            <footer className="footer-wrapper">
                <div className="footer-main">
                <div className="flex-column footer-center">
                    <img src={Logo} alt="The Smoke Show logo" width="100" className="footer-logo"/>
                    
                    <p>
                    ©{getYear()} The Hoon Group. All Rights Reserved.
                    <div className="show-mobile"><br/></div>
                    <Link to="/about" style={{margin: '0 1rem'}}>
                        Contact Us 
                    </Link>
                    |
                    <Link to="/privacy-policy" style={{margin: '0 1rem'}}>
                        Privacy Policy
                    </Link>
                    |
                    <Link to="/terms" style={{marginLeft: '1rem'}}>
                        Terms of Use
                    </Link>
                    </p>
                </div>
                {/* <div className="footer-left">
                    <img src={Logo} alt="The Smoke Show logo" width="100" className="footer-logo"/>
                    <p>
                    ©{getYear()} The Hoon Group. All Rights Reserved. |
                    <Link to="/about" style={{margin: '0 1rem'}}>
                        Contact Us 
                    </Link>
                    |
                    <Link to="/privacy-policy" style={{margin: '0 1rem'}}>
                        Privacy Policy
                    </Link>
                    |
                    <Link to="/terms" style={{margin: '0 1rem'}}>
                        Terms of Use
                    </Link>
                    </p>
                </div> */}
                    {/* <div className="footer-right">
                    <Link to="/about" style={{margin: '0 1rem'}}>
                    Contact Us 
                    </Link>
                    | 
                    <Link to="/privacy-policy" style={{marginLeft: '1rem'}}>
                    Privacy Policy
                    </Link>
                    </div> */}
                </div>
                
            </footer>
            {/* <div className="bottom-space-footer"></div> */}
        </Fragment>
        
    )
}

export default Footer