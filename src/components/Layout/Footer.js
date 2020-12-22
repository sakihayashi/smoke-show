import React from 'react'
import './footer.scss'

const Footer = () =>{
    const getYear = () =>{
        return new Date().getFullYear();
    }
    return(
        <footer className="footer-wrapper">
            <div className="footer-main">
            ©{getYear()} The Hoon Group All Rights reserved. 
            </div>
        </footer>
    )
}

export default Footer