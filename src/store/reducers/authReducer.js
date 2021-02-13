const initState = {
    credentials: {},
    loginUserData: {},
    isLoggedIn: false,
    customData: {},
    hasLoginErr: false
}

const authReducer = (state = initState, action) =>{
    
    switch(action.type){
        case 'AUTH_USER':
            return {
                credentials: action.userData.credentials,
                loginUserData: action.userData.loginUserData
            }
        
        case 'LOGIN_SUCCESS':
            return{
                customData: action.customData,
                isLoggedIn: true
            }
        case 'LOGIN_FAIL':
            return{
                isLoggedIn: false,
                hasLoginErr: true
            }
        case 'LOGOUT':
            return{
                isLoggedIn: false,
                customData: {}
            }
        default: return state
    }
// return state
}

export default authReducer