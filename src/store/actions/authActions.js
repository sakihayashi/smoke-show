import * as Realm from "realm-web"
import jwt from 'jsonwebtoken'

const appConfig = {
    id: process.env.REACT_APP_REALM_APP_ID,
    // timeout: 10000, 
    // timeout in number of milliseconds
  };
const app = new Realm.App(appConfig);
const maxAgeTest = 1 * 60 * 60

export const logInUser = (credentials, email) =>{
    return (dispatch, getState)=>{
        app.logIn(credentials).then(user=>{

            const customData = user.customData
            customData.email = email
            const token = jwt.sign({ userData: customData }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest})
            const tokenCredentials = jwt.sign({ cre: credentials }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest})
            sessionStorage.setItem('session_token', token)
            sessionStorage.setItem('session_user', tokenCredentials)
            dispatch({type: 'LOGIN_SUCCESS', customData})
        }).catch(err =>{
            dispatch({type: 'LOGIN_FAIL'})
        })
    }
}

export const logOutUser = () =>{
    console.log('fired?')
    return (dispatch, getState)=>{
        sessionStorage.removeItem('session_token')
        sessionStorage.removeItem('session_user')
        app.currentUser.logOut().then(res =>{
            console.log('res', res)
            dispatch({type: 'LOGOUT'})
        })
    }
}

export const authUser = (userData) =>{
    //with thunk, we can reutrn function but otherwise, return state
    return (dispatch, getState) =>{
        //make async call here
        dispatch({type: 'AUTH_USER', userData})
    }
}

export const loggedInUser = (userData) =>{
    return(dispatch, getState) =>{
        dispatch({type: 'LOGGED_USER', userData})
    }
}