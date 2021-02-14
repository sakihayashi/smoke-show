import React, { useState, useEffect  } from 'react'
import Header from './Header'
import Footer from './Footer'
import { withRouter } from "react-router"
import { connect } from 'react-redux'
// import { openLoginModal } from '../../store/actions/userActions'
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
    const handleuser = (fname, userId) =>{
        // console.log('value check', userId)
        setUser(true)
        setUsername(fname)
        setUserId(userId)
        setModalShow(false)
        if(props.userLoggedIn){
            props.userLoggedIn(userId)
        }
        
    }
    // const updateLoggedOut = (id) =>{
    //     props.userLoggedOut(id)
    // }

    // const updateUserName = (fname) =>{
    //     setUser(true)
    //     setUsername(fname)
    // }

    useEffect(() => {
        handleModal()
    }, [props.openModal])

    return(
        <div>
            <HeaderWithRouter handleuser={handleuser} modalShowHide={modalShowHide} user={user} username={username} changeUserState={changeUserState} funcSetUsername={funcSetUsername} modalShow={modalShow} userLoggedOut={props.userLoggedOut} userId={userId} />
    
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
        // modalShowHide: (state) =>dispatch(modalShowHide(state))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)