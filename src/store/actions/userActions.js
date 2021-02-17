
import * as Realm from "realm-web"

const getApp = Realm.App.getApp(process.env.REACT_APP_REALM_APP_ID);

// export const createNewUser = (userObj) =>{
//     //with thunk, we can reutrn function but otherwise, return state
    
//     return (dispatch, getState) =>{
//         //make async call here
//         // await getApp.emailPasswordAuth.registerUser(userObj.email, userObj.password).then(res =>{
//         //     console.log('response', res)
//             dispatch({type: 'CREATE_USER', userObj})
//         // })
        
//     }
// }
// export const openLoginModal = (state) =>{
//     console.log('working?', state)
//     return (dispatch, getState)=>{
//         dispatch({type: 'OPEN_LOGIN_MODAL', state})
//     }
// }

export const becomeAFan = (data) =>{
    return (dispatch, getState) =>{
        //save data to mongodb
        dispatch({type: 'BECOME_FAN', data})
    }

}