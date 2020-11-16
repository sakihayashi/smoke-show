import React, {useState} from 'react'
import { Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap'
import Logo from '../../assets/global/Logo-smoke-show.png'
import './header.scss'
import * as Realm from "realm-web"
import LoginModal from './LoginModal'
import SignUpModal from './SignUpModal'

// const REALM_APP_ID = "smoke-show-test-uasqg"; 


const Header = () =>{
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
                    <Nav className="mr-auto nav-style" >
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#link">Influencers</Nav.Link>
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

export default Header