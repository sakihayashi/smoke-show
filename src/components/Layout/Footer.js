import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './footer.scss'

const Footer = () =>{
    const getYear = () =>{
        return new Date().getFullYear();
    }
    const infolinks = ()=>{

    }
    // <script type="text/javascript"> var infolinks_pid = 3313988; var infolinks_wsid = 0; </script> <script type="text/javascript" src="//resources.infolinks.com/js/infolinks_main.js"></script>
    useEffect(() => {
        const script = document.createElement('script');
        const script1 = document.createElement('script');
        script.src = "//resources.infolinks.com/js/infolinks_main.js";
        // script.async = true;
        script.type = "text/javascript"
        script1.type = "text/javascript"
        script1.text = `var infolinks_pid = 3313988; var infolinks_wsid = 0;`
        document.body.appendChild(script);
        document.body.appendChild(script1);
      
        // return () => {
        //   document.body.removeChild(script);
        //   document.body.removeChild(script);
        // }
      }, []);
    return(
        <footer className="footer-wrapper">
            <div className="footer-main">
            <Link to="/about" style={{margin: '0 1rem'}}>
            Contact Us 
            </Link>
             | 
             <Link to="/terms" style={{margin: '0 1rem'}}>
             Privacy Policy
             </Link>
              | ©{getYear()} The Hoon Group. All Rights reserved
            </div>
        </footer>
    )
}

export default Footer