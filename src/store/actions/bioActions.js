export const createMyCar = (car) =>{
    return (dispatch, getState)=>{
        dispatch({type: 'CREATE_CAR', car})
    }
}


