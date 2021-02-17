import authReducer from './authReducer'
import userReducer from './userReducer'
import bioReducer from './bioReducer'
import influencerReducer from './influencerReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    bio: bioReducer,
    influ: influencerReducer
})

export default rootReducer