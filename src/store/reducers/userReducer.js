const initState = {
    fname: '', 
    lname: '', 
    email: 'test@mail.com', 
    password: '', 
    password2: '',
}

const userReducer = (state = initState, action) =>{
    switch(action.type){
    
        
        // case 'BECOME_FAN': 
        //     console.log('from reducer', action.userObj)
        //     return action.userObj
        // default:
        //     console.log('error', action)
    }
    return state
}

export default userReducer