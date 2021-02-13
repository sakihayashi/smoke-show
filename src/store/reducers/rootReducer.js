import authReducer from './authReducer'
import userReducer from './userReducer'
import bioReducer from './bioReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    bio: bioReducer
})

// const initState = {
//     username: 'Saki'
// }

// const rootReducer = (state = initState, action) =>{
//     return state
// }

export default rootReducer