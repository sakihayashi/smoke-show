import authReducer from './authReducer'
import userReducer from './userReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer
})

// const initState = {
//     username: 'Saki'
// }

// const rootReducer = (state = initState, action) =>{
//     return state
// }

export default rootReducer