export const authUser = (userData) =>{
    //with thunk, we can reutrn function but otherwise, return state
    return (dispatch, getState) =>{
        //make async call here
        dispatch({type: 'AUTH_USER', userData})
    }
}

export const loggedInUser = (userData) =>{
    return(dispatch, getState) =>{
        dispatch({type: 'LOGGED_USER', userData})
    }
}