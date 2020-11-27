const initState = {fname: '', lname: '', email: 'test@mail.com', password: '', password2: ''}

const userReducer = (state = initState, action) =>{
    switch(action.type){
        case 'CREATE_USER':
            console.log('user from reducer', action.userObj)
            return action.userObj
        default:
            console.log('error', action)
    }
    return state
}

export default userReducer