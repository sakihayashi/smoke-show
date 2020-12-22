import React, { useState, useImperativeHandle, forwardRef } from 'react'
import Header from './Header'
import Footer from './Footer'
import { withRouter } from "react-router"

const HeaderWithRouter = withRouter(Header);

const Layout = forwardRef((props, ref) =>{
    const [modalShow, setModalShow] = useState(false)
    const [user, setUser] = useState(false)
    const [username, setUsername] = useState('')

    const modelShowHide = (state)=>{
        setModalShow(state)
    }
    const changeUserState = (state) =>{
        setUser(state)
    }
    const funcSetUsername = (name) =>{
        console.log('name', name)
        setUsername(name)
    }
    const handleuser = (fname) =>{
        setUser(true)
        setUsername(fname)
        setModalShow(false)
    }
    useImperativeHandle(
        ref,
        (fname) => ({
            handleUserByParent(fname){
                setUser(true)
                setUsername(fname)
            }
        }),
    )

    return(
        <div>
            <HeaderWithRouter handleuser={handleuser} modalShowHide={modelShowHide} user={user} username={username} changeUserState={changeUserState} funcSetUsername={funcSetUsername} modalShow={modalShow}/>
                { props.children }
            <Footer />
        </div>

    )
})

export default Layout 