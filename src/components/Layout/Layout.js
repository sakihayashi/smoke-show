import React, { useState, useEffect  } from 'react'
import Header from './Header'
import Footer from './Footer'
import { withRouter } from "react-router"
import { connect } from 'react-redux'
import jwt from 'jsonwebtoken'
import { updateLogin, logInAsPublic } from '../../store/actions/authActions'
const HeaderWithRouter = withRouter(Header);

const Layout = (props) =>{
    // const [modalShow, setModalShow] = useState(false)
    const [user, setUser] = useState(false)
    const [username, setUsername] = useState('')
    const [userId, setUserId] = useState('')
    

    // const handleModal = () =>{
    //     console.log('modal state', props.openmodal)
    //     setModalShow(props.openmodal)
    // }
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
        const tokenUser = sessionStorage.getItem('session_user')
        jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, async (err, decoded)=>{
            if(err){
                
                props.logInAsPublic()
            }else{
                props.updateLogin(decoded.cre)
            }
        })
    }, [])

    
   

    return(
        <div>
            <HeaderWithRouter  user={user} username={username} changeUserState={changeUserState} funcSetUsername={funcSetUsername}  userLoggedOut={props.userLoggedOut} userId={userId} />
    
                { props.children }
            <Footer />
        </div>

    )
}

const mapStateToProps = (state) =>{
    // console.log('redux', state)
    return{
        // openmodal: state.user.openmodal
    }
}
const mapDispatchToProps = (dispatch) =>{
    return{
        logInAsPublic: ()=>dispatch(logInAsPublic()),
        updateLogin: (credentials)=>dispatch(updateLogin(credentials))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)