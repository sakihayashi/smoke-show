import React, { useState, useEffect  } from 'react'
import Header from './Header'
import Footer from './Footer'
import { withRouter } from "react-router"
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'
import { updateLogin, logInAsPublic } from '../../store/actions/authActions'
const HeaderWithRouter = withRouter(Header);

const Layout = (props) =>{
    const [modalShow, setModalShow] = useState(false)
    const [user, setUser] = useState(false)
    const [username, setUsername] = useState('')
    const [userId, setUserId] = useState('')
    
    const modalShowHide = (state)=>{
        setModalShow(state)
        // props.openLoginModal()
    }
    const handleModal = () =>{
        console.log('modal state', props.openModal)
        setModalShow(props.openModal)
    }
    const changeUserState = (id) =>{
        setUser(false)
        if(props.userLoggedOut){
            props.userLoggedOut(id)
        }
        
    }
    const funcSetUsername = (name) =>{
        setUsername(name)
    }

    useEffect(() => {
        const token = sessionStorage.getItem('session_token')
        jwt.verify(token, process.env.REACT_APP_JWT_SECRET, async (err, decoded)=>{
            if(err){
                props.logInAsPublic()
            }else{
                const tokenUser = sessionStorage.getItem('session_user')
                const credentials = jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET)
                console.log('value', credentials)
                props.updateLogin(credentials.cre)
            }
        })
    }, [])

    useEffect(() => {
        handleModal()
    }, [props.openModal])
   

    return(
        <div>
            <HeaderWithRouter modalShowHide={modalShowHide} user={user} username={username} changeUserState={changeUserState} funcSetUsername={funcSetUsername} modalShow={modalShow} userLoggedOut={props.userLoggedOut} userId={userId} />
    
                { props.children }
            <Footer />
        </div>

    )
}

const mapStateToProps = (state) =>{
    // console.log('redux', state)
    return{
        openModal: state.user.openModal
    }
}
const mapDispatchToProps = (dispatch) =>{
    return{
        logInAsPublic: ()=>dispatch(logInAsPublic()),
        updateLogin: (credentials)=>dispatch(updateLogin(credentials))
        // modalShowHide: (state) =>dispatch(modalShowHide(state))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)