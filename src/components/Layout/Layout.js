import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import Header from './Header'
import Footer from './Footer'
import { withRouter } from "react-router"

const HeaderWithRouter = withRouter(Header);

const Layout = forwardRef((props, ref, refModal) =>{
    const [modalShow, setModalShow] = useState(false)
    const [user, setUser] = useState(false)
    const [username, setUsername] = useState('')
    const [userId, setUserId] = useState('')
    
    // const parentRef = useRef()
    const modalShowHide = (state)=>{
        setModalShow(state)
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
        console.log('value check', userId)
        setUser(true)
        setUsername(fname)
        setUserId(userId)
        setModalShow(false)
        props.userLoggedIn(userId)
    }
    // const updateLoggedOut = (id) =>{
    //     props.userLoggedOut(id)
    // }
    useImperativeHandle(
        ref,
        (fname) => ({
            handleUserByParent(fname){
                setUser(true)
                setUsername(fname)
            }
        }),
    )
    // useImperativeHandle(
    //     refModal,
    //     () =>({
    //         handleLoginModal(state){
    //             modalShowHide(state)
    //         }
    //     })
    // )
    useImperativeHandle(refModal, (state) => ({
        handleLoginModal: modalShowHide(state)
      })
    )

    return(
        <div>
            <HeaderWithRouter handleuser={handleuser} modalShowHide={modalShowHide} user={user} username={username} changeUserState={changeUserState} funcSetUsername={funcSetUsername} modalShow={modalShow} userLoggedOut={props.userLoggedOut} userId={userId} />
                { props.children }
            <Footer />
        </div>

    )
})

export default Layout 