
// import * as Realm from "realm-web"

export const updateProfilePage = (userId) =>{
    return(dispatch, getState)=>{
        dispatch({type: 'UPDATE_PROFILEPAGE', userId})
    }
}


export const becomeAFan = (data) =>{
    return (dispatch, getState) =>{
        //save data to mongodb
        dispatch({type: 'BECOME_FAN', data})
    }

}