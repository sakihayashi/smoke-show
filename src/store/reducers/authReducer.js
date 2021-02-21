const initState = {
    credentials: {},
    loginUserData: {},
    isLoggedIn: false,
    customData: {},
    hasLoginErr: false,
    mongo: null,
    isPublicView: false,
    openModal: false,
    modalMsg: '',
    errMsg: ''
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
                openModal: false
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
                openModal: action.state
            }
        case 'ATTACH_MSG':
            console.log('msg', action.msg)
            return{
                ...state,
                modalMsg: action.msg
            }
        // default: return state
    }
return state
}

export default authReducer