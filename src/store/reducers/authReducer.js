const initState = {
    credentials: {},
    loginUserData: {}
}

const authReducer = (state = initState, action) =>{
    
    switch(action.type){
        case 'AUTH_USER':
            return {
                credentials: action.userData.credentials,
                loginUserData: action.userData.loginUserData
            }
        default: return state
    }
console.log('state', state)
return state
}

export default authReducer