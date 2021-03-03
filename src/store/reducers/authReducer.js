const initState = {
    credentials: {},
    loginUserData: {},
    isLoggedIn: false,
    customData: {},
    hasLoginErr: false,
    mongo: null,
    isPublicView: false,
    openmodal: false,
    modalMsg: '',
    errMsg: '',
    swapSignup: ''
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
                isLoggedIn: true,
                openmodal: false
            }
        case 'LOGIN_FAIL':
            return{
                ...state,
                isLoggedIn: false,
                hasLoginErr: true,
                errMsg: action.msg
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
                isLoggedIn: false,
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
        case 'OPEN_LOGIN_MODAL':
            return {
                ...state,
                openmodal: action.state
            }
        case 'SWAP_SIGNUP':
            return{
                ...state,
                openmodal: true,
                swapSignup: 'signup'
            }
        case 'SWAP_LOGIN':
            return{
                ...state,
                swapSignup: ''
            }
        case 'ATTACH_MSG':
            return{
                ...state,
                modalMsg: action.msg
            }
        // default: return state
    }
return state
}

export default authReducer