import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap'
import Logo from '../../assets/global/Logo-smoke-show.png'
import './header.scss'
import * as Realm from "realm-web"
import LoginModal from './LoginModal'
import SignUpModal from './SignUpModal'
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'
// const REALM_APP_ID = "smoke-show-test-uasqg"; 


const Header = (props) =>{
    const { location } = props
    console.log('location', props)
    // const app = new Realm.App({ id: process.env.REALM_APP_ID })
    const app = new Realm.App({ id: "smoke-show-test-uasqg" })
    const getApp = Realm.App.getApp("smoke-show-test-uasqg");

    const [user, setUser] = useState(false)
    const [username, setUsername] = useState('')
    const [hasAccount, setHasAccount] = useState(true)
    const [modalShow, setModalShow] = useState(false)

    const logIn = async ()=>{
        setModalShow(true)
    }
    const logOut = async () =>{
        setUser(false)
        localStorage.removeItem('session_token')
        await getApp.currentUser.logOut();

    }
     const handleUser = (fname) =>{
         setUser(true)
         setUsername(fname)
         setModalShow(false)
     }
     const toggleModal = () =>{
         setHasAccount(!hasAccount)
     }
     useEffect(() => {
         let tokenLocalStorage = localStorage.getItem('session_token')
         if(tokenLocalStorage){
            jwt.verify(tokenLocalStorage, 'smoke_show_secret', (err, decoded)=>{
                if(err){
                    console.log(err)
                    setUser(false)
                }else{
                    setUser(true)
                    setUsername(decoded.userData.fname)
                }
            });
            
         }
     }, [])

    return(
        <header>
            <div className="login-wrapper">
            {user ? <div >Hi {username}, <Button className="btn-login"  onClick={logOut}>Logout</Button></div> :
            <Button className="btn-login" onClick={logIn}>Login</Button>
            }
            { hasAccount ? <LoginModal 
            show={modalShow}  
            onHide={()=>setModalShow(false)}
            app={app}
            handleUser={handleUser}
            toggleModal={toggleModal}
            />
            : <SignUpModal
            show={modalShow}  
            onHide={()=>setModalShow(false)}
            app={app}
            handleUser={handleUser}
            toggleModal={toggleModal}
             />
            }
                
            </div>
            <Navbar expand="lg" className="header-wrapper">
                <Navbar.Brand href="#home">
                    <img className="logo-header" src={Logo} alt="The Smoke Show logo"/>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto nav-style" activeKey={location.pathname}>
                    {/* <Nav.Link href="#home">Home</Nav.Link> */}
                        <Nav.Link href="/" >Home</Nav.Link>
                        <Nav.Link href="/influencers"  >Influencers</Nav.Link>
                    {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown> */}
                    </Nav>
                    <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    {/* <Button className="btn-search">Search</Button> */}
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        </header>
    )
}

const mapStateToProps = (state) =>{
    return{
        userId: state.userId,
    }
}

export default connect(mapStateToProps)(Header)