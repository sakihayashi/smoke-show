
import * as Realm from "realm-web"

const getApp = Realm.App.getApp("smoke-show-test-uasqg");

export const createNewUser = (userObj) =>{
    //with thunk, we can reutrn function but otherwise, return state
    
    return (dispatch, getState) =>{
        //make async call here
        // await getApp.emailPasswordAuth.registerUser(userObj.email, userObj.password).then(res =>{
        //     console.log('response', res)
            dispatch({type: 'CREATE_USER', userObj})
        // })
        
    }
}

