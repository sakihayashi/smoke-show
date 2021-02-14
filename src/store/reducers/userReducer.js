const initState = {
    fname: '', 
    lname: '', 
    email: 'test@mail.com', 
    password: '', 
    password2: '',
    openModal: false
}

const userReducer = (state = initState, action) =>{
    switch(action.type){
        case 'OPEN_LOGIN_MODAL':
            console.log('user from reducer', action.state)
            return {
                openModal: action.state
            }
        
        case 'BECOME_FAN': 
            console.log('from reducer', action.userObj)
            return action.userObj
        // default:
        //     console.log('error', action)
    }
    return state
}

export default userReducer