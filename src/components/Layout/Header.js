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
// import bioPic from '../../assets/temp-photos/bio/avator-male.jpg'

const Header = (props) =>{
    const location = useLocation()
    const [currentUser, setCurrentUser] = useState('')
    const id = process.env.REACT_APP_REALM_APP_ID
    const app = new Realm.App({ id: id })
    const productionUrl = 'https://master.d3l3iqr3dhkcvm.amplifyapp.com/'
    // const devUrl = 'http://localhost:3000/'

    const [hasAccount, setHasAccount] = useState(true)
    
    const logIn = async ()=>{
        props.modalShowHide(true)
    }
    const logOut = () =>{
        props.logOutUser()
        // props.changeUserState(app.currentUser.id)
        // sessionStorage.removeItem('session_token')
        
        // await app.currentUser.logOut().then(res =>{
        //     console.log('res', res)
        // })
    }
     const getUserId = (id) =>{
         setCurrentUser(id)
     }
     const toggleModal = () =>{
         setHasAccount(!hasAccount)
     }

     const loggedInDiv = 
     <Fragment>
        <div >Hi {props.customData.username}, <Button className="btn-login"  onClick={logOut}>Logout</Button><a href={productionUrl + 'user/' + currentUser}><img src={settingsIcon} className="setting-icon-nav"  /></a>
        </div>
     </Fragment>

     useEffect(() => {
         if(props.isLoggedIn){
            props.modalShowHide(false)
         }else{
            logOutUser()
         }
     }, [props.isLoggedIn])

    //  useEffect(() => {
    //      let token = sessionStorage.getItem('session_token')
    //      if(token){
    //         jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
    //             if(err){
    //                 console.log('jwt time out')

    //             }else{
    //                 const tokenUser = sessionStorage.getItem('session_user')
    //                 const credentials = jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET)
    //                 props.logInUser(credentials.cre, decoded.userData.email)
    //             }
    //         })
    //      }
    //  }, [])
    //  useEffect(() => {
    //      let tokenSessionStorage = sessionStorage.getItem('session_token')
    //      if(tokenSessionStorage){
    //         jwt.verify(tokenSessionStorage, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
    //             if(err){
    //                 console.log(err)
    //                 props.changeUserState(false)
    //             }else{
    //                 props.changeUserState(true)
    //                 props.funcSetUsername(decoded.userData.fname)
    //                 props.handleuser(decoded.userData.fname, decoded.userData.userId)
    //                 setCurrentUser(decoded.userData.userId)
    //                 console.log(decoded.userData.userId)

    //             }
    //         });
            
    //      }
    //  }, [])

    return(
        <header>
            <div className="login-wrapper">
            {props.isLoggedIn ? loggedInDiv : 
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
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        logOutUser: () => dispatch(logOutUser()),
        logInUser: (credentials, email) => dispatch(logInUser(credentials, email))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)