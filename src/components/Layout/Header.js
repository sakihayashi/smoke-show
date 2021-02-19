import React, { useState, useEffect, Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar, Nav, Button} from 'react-bootstrap'
import Logo from '../../assets/global/Logo-smoke-show.png'
import './header.scss'
import * as Realm from "realm-web"
import LoginModal from './LoginModal'
import SignUpModal from './SignUpModal'
import { connect } from 'react-redux'
import { logOutUser } from '../../store/actions/authActions'
import { logInUser } from '../../store/actions/authActions'
import jwt from 'jsonwebtoken'
import settingsIcon from '../../assets/global/Settings-icon-white.svg'
import { openLoginModal } from '../../store/actions/authActions'

const Header = (props) =>{
    const location = useLocation()
    const [currentUser, setCurrentUser] = useState('')
    const id = process.env.REACT_APP_REALM_APP_ID
    const app = new Realm.App({ id: id })
    

    const [hasAccount, setHasAccount] = useState(true)
    
    const logIn = async ()=>{
        // props.modalShowHide(true)
        props.openLoginModal(true)
    }
    const logOut = () =>{
        props.logOutUser()

    }
     const getUserId = (id) =>{
         setCurrentUser(id)
     }
     const toggleAuthModal = () =>{
         console.log('fired?')
         setHasAccount(!hasAccount)
     }

     const loggedInDiv = 
     <Fragment>
        <div >Hi {props.customData.username}, <Button className="btn-login"  onClick={logOut}>Logout</Button>
        <Link to={`/user/${props.customData.userId}`}><img src={settingsIcon} className="setting-icon-nav"  /></Link>
        </div>
     </Fragment>

    // useEffect(() => {
    //     setShow(props.openModal)
    // }, [props.openModal])
    return(
        <header>
            <div className="login-wrapper">
            {props.isLoggedIn ? loggedInDiv : 
            <Button className="btn-login" onClick={logIn}>Login</Button>
            }
            { hasAccount ? <LoginModal 
            // show={show}  
            // onHide={handleClose}
            app={app}
            // handleuser={props.handleuser}
            toggleAuthModal={toggleAuthModal}
            // getUserId={getUserId}
            />
            : <SignUpModal
            // show={props.modalShow}  
            // onHide={handleClose}
            app={app}
            // handleuser={props.handleuser}
            toggleAuthModal={toggleAuthModal}
             />
            }
                
            </div>
            <Navbar expand="lg" className="header-wrapper">
                <Navbar.Brand href="/">
                        <img className="logo-header" src={Logo} alt="The Smoke Show logo"/>                    
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto nav-style" activeKey={location.pathname}>
                        <Nav.Link href="/" >Home</Nav.Link>
                        <Nav.Link href="/influencers" >Influencers</Nav.Link>
                        <Nav.Link href="/car-search">Car Stats</Nav.Link>
                        <Nav.Link href="/giveaways">Giveaways</Nav.Link>
                        <Nav.Link href="/swagg">Swagg</Nav.Link>
                        <Nav.Link href="/about">About</Nav.Link>
                    </Nav>
                    {/* <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" /> */}
                    {/* <Button className="btn-search">Search</Button> */}
                    {/* </Form> */}
                </Navbar.Collapse>
            </Navbar>
        </header>
    )
}

const mapStateToProps = (state) =>{
    return{
        isLoggedIn: state.auth.isLoggedIn,
        customData: state.auth.customData,
        userId: state.userId,
        openModal: state.auth.openModal
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        logOutUser: () => dispatch(logOutUser()),
        logInUser: (credentials, email) => dispatch(logInUser(credentials, email)),
        openLoginModal: (state) => dispatch(openLoginModal(state))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)