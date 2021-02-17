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
            if(app.currentUser.id === user.id){
                console.log('current user updated')
            }else{
                console.log('current user not match')
            }
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
export const openLoginModal = (state) =>{
    console.log('working?', state)
    return (dispatch, getState)=>{
        dispatch({type: 'OPEN_LOGIN_MODAL', state})
    }
}
export const logInAsPublic = () =>{
    return(dispatch, getState)=>{
        const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
        app.logIn(credentials).then( user =>{
            if(app.currentUser.id === user.id){
                console.log('app user is public')
            }else{
                console.log('app user id is not updated')
            }
            dispatch({type: 'LOGIN_PUBLIC'})
        })
    }
}

export const updateLogin = (credentials) =>{
    console.log(credentials)
    return(dispatch, getState)=>{
        app.logIn(credentials).then(user =>{
            const customData = user.customData
            if(app.currentUser.id === user.id){

                console.log('user updated')
                
            }else{
                console.log('user id not updated but loggedin')
             
            }
            dispatch({type: 'LOGIN_UPDATE', customData})
        })
    }
}
export const logInAsCurrent = () =>{
    return(dispatch, getState)=>{
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        dispatch({type: 'LOGIN_CURRENT', mongo})
    }
}

export const checkLogin = () =>{
    const token = sessionStorage.getItem('session_user')
    return (dispatch, getState)=>{
        if(token){
            jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, decoded)=>{
                if(err){
                    
                }else{
                    app.logIn(decoded.cre).then( user =>{
                        const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                        dispatch({type: 'LOGIN_CHECK', mongo})
                    })
                }
            })
        }else{
            const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
            app.logIn(credentials).then( user =>{
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                dispatch({type: 'LOGIN_CHECK', mongo})
            })
        }
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