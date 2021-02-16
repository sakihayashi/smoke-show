const initState = {
    credentials: {},
    loginUserData: {},
    isLoggedIn: false,
    customData: {},
    hasLoginErr: false,
    mongo: null,
    isPublicView: false
}

const authReducer = (state = initState, action) =>{
    
    switch(action.type){
        case 'AUTH_USER':
            return {
                ...state,
                credentials: action.userData.credentials,
                loginUserData: action.userData.loginUserData
            }
        
        case 'LOGIN_SUCCESS':
            return{
                ...state,
                customData: action.customData,
                isLoggedIn: true
            }
        case 'LOGIN_FAIL':
            return{
                ...state,
                isLoggedIn: false,
                hasLoginErr: true
            }
        case 'LOGOUT':
            return{
                ...state,
                isLoggedIn: false,
                customData: {}
            }
        case 'LOGIN_CHECK':
            return{
                ...state,
                mongo: action.mongo
            }
        case 'LOGIN_PUBLIC':
            return{
                ...state,
                isPublicView: true
            }
        case 'LOGIN_CURRENT':
            return{
                // isLoggedIn: false,
                ...state,
                mongo: action.mongo
            }
        case 'LOGIN_UPDATE':
            return{
                ...state,
                customData: action.customData,
                isLoggedIn: true
            }
        // default: return state
    }
return state
}

export default authReducer