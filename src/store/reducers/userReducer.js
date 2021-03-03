const initState = {
  profilepageid: '',
}

const userReducer = (state = initState, action) =>{
    switch(action.type){

        case 'UPDATE_PROFILEPAGE': 
        console.log('reducer', action.userId)
            return {
                ...state,
                profilepageid: action.userId
            }
        // default:
        //     console.log('error', action)
    }
    return state
}

export default userReducer