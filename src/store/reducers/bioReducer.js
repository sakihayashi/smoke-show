import * as Realm from "realm-web"

const initState = {}

const bioReducer = (state = initState, action) =>{
    
    switch(action.type){
        case 'CREATE_CAR':
            console.log('car created', action.car)
        // default: return state
    }
return state
}

export default bioReducer