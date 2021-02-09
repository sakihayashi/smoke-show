import React, { useState, useEffect, Fragment } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap'
import Logo from '../../assets/global/Logo-smoke-show.png'
import './header.scss'
import * as Realm from "realm-web"
import LoginModal from './LoginModal'
import SignUpModal from './SignUpModal'
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'
import settingsIcon from '../../assets/global/Settings-icon-white.svg'
// import bioPic from '../../assets/temp-photos/bio/avator-male.jpg'

const Header = (props) =>{
    let history = useHistory();
    const location = useLocation()
    const [currentUser, setCurrentUser] = useState('')
    const id = process.env.REACT_APP_REALM_APP_ID
    // const app = new Realm.App({ id: process.env.REALM_APP_ID })
    const app = new Realm.App({ id: id })
    const productionUrl = 'https://master.d3l3iqr3dhkcvm.amplifyapp.com/'
    const devUrl = 'http://localhost:3000/'

    const [hasAccount, setHasAccount] = useState(true)
    
    const logIn = async ()=>{
        props.modalShowHide(true)
    }
    const logOut = async () =>{
        props.changeUserState(app.currentUser.id)
        sessionStorage.removeItem('session_token')
        // props.userLoggedOut(app.currentUser.id)
        // console.log('x', app.currentUser.id)
        await app.currentUser.logOut().then(res =>{
            console.log('res', res)
        })
    }
     const getUserId = (id) =>{
         setCurrentUser(id)
     }
     const toggleModal = () =>{
         setHasAccount(!hasAccount)
     }
     const handleLink = () =>{
         history.push('/user/' + currentUser)
     }
     const loggedInDiv = 
     <Fragment>
        <div >Hi {props.username}, <Button className="btn-login"  onClick={logOut}>Logout</Button><a href={productionUrl + 'user/' + currentUser}><img src={settingsIcon} className="setting-icon-nav"  /></a>
        </div>
     </Fragment>
     useEffect(() => {
         let tokenSessionStorage = sessionStorage.getItem('session_token')
         if(tokenSessionStorage){
            jwt.verify(tokenSessionStorage, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
                if(err){
                    console.log(err)
                    props.changeUserState(false)
                }else{
                    props.changeUserState(true)
                    props.funcSetUsername(decoded.userData.fname)
                    props.handleuser(decoded.userData.fname, decoded.userData.userId)
                    setCurrentUser(decoded.userData.userId)
                    console.log(decoded.userData.userId)

                }
            });
            
         }
     }, [])

    return(
        <header>
            <div className="login-wrapper">
            {props.user ? loggedInDiv : 
            <Button className="btn-login" onClick={logIn}>Login</Button>
            }
            { hasAccount ? <LoginModal 
            show={props.modalShow}  
            onHide={()=>props.modalShowHide(false)}
            app={app}
            handleuser={props.handleuser}
            toggleModal={toggleModal}
            getUserId={getUserId}
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
                    <Link to="/">
                        <img className="logo-header" src={Logo} alt="The Smoke Show logo"/>
                    </Link>
                    
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto nav-style" activeKey={location.pathname}>
                        <Nav.Link href="/" >Home</Nav.Link>
                        <Nav.Link href="/influencers"   >Influencers</Nav.Link>
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
        userId: state.userId,
    }
}

export default connect(mapStateToProps)(Header)