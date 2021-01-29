import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import Header from './Header'
import Footer from './Footer'
import { withRouter } from "react-router"

const HeaderWithRouter = withRouter(Header);

const Layout = forwardRef((props, ref) =>{
    const [modalShow, setModalShow] = useState(false)
    const [user, setUser] = useState(false)
    const [username, setUsername] = useState('')
    const parentRef = useRef()
    const modalShowHide = (state)=>{
        setModalShow(state)
    }
    const changeUserState = (state) =>{
        setUser(state)
    }
    const funcSetUsername = (name) =>{
        console.log('name', name)
        setUsername(name)
    }
    const handleuser = (fname, userId) =>{
        setUser(true)
        setUsername(fname)
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
    useImperativeHandle(
        ref,
        () =>({
            handleLoginModal(state){
                modalShowHide(state)
            }
        })
    )

    return(
        <div>
            <HeaderWithRouter handleuser={handleuser} modalShowHide={modalShowHide} user={user} username={username} changeUserState={changeUserState} funcSetUsername={funcSetUsername} modalShow={modalShow} userLoggedOut={props.userLoggedOut} />
                { props.children }
            <Footer />
        </div>

    )
})

export default Layout 