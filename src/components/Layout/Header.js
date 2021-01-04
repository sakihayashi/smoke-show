import React, { useState, useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap'
import Logo from '../../assets/global/Logo-smoke-show.png'
import './header.scss'
import * as Realm from "realm-web"
import LoginModal from './LoginModal'
import SignUpModal from './SignUpModal'
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'


const Header = (props) =>{
    const location = useLocation();
    const id = process.env.REACT_APP_REALM_APP_ID
    // const app = new Realm.App({ id: process.env.REALM_APP_ID })
    const app = new Realm.App({ id: id })
    const getApp = Realm.App.getApp(id);

    const [hasAccount, setHasAccount] = useState(true)
    
    const logIn = async ()=>{
        props.modalShowHide(true)
    }
    const logOut = async () =>{
        props.changeUserState(false)
        localStorage.removeItem('session_token')
        await getApp.currentUser.logOut()
    }
     
     const toggleModal = () =>{
         setHasAccount(!hasAccount)
     }
     useEffect(() => {
         let tokenLocalStorage = localStorage.getItem('session_token')
         if(tokenLocalStorage){
            jwt.verify(tokenLocalStorage, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
                if(err){
                    console.log(err)
                    props.changeUserState(false)
                }else{
                    props.changeUserState(true)
                    props.funcSetUsername(decoded.userData.fname)
                }
            });
            
         }
     }, [])

    return(
        <header>
            <div className="login-wrapper">
            {props.user ? <div >Hi {props.username}, <Button className="btn-login"  onClick={logOut}>Logout</Button></div> :
            <Button className="btn-login" onClick={logIn}>Login</Button>
            }
            { hasAccount ? <LoginModal 
            show={props.modalShow}  
            onHide={()=>props.modalShowHide(false)}
            app={app}
            handleuser={props.handleuser}
            toggleModal={toggleModal}
            />
            : <SignUpModal
            show={props.modalShow}  
            onHide={()=>props.modalShowHide(false)}
            app={app}
            handleuser={props.handleuser}
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
                        <Nav.Link href="/influencers"   >Influencers</Nav.Link>
                        <Nav.Link href="/car-search">Car Stats</Nav.Link>
                        <Nav.Link href="/giveaways">Giveaways</Nav.Link>
                        {/* <Nav.Link as={Link} to="/about">About</Nav.Link> */}
                        <Nav.Link href="/about">About</Nav.Link>
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