const initState = {
    influencerObj: {},
    formattedFans: ''
}

const influencerReducer = (state = initState, action) =>{
    switch(action.type){
        case 'GET_INFLUENCER':
            console.log('user from reducer', action.state)
            return {
                ...state,
                influencerObj: action.influencer,
                formattedFans: action.formattedFans
            }
        
        // case 'BECOME_FAN': 
        //     console.log('from reducer', action.userObj)
        //     return action.userObj
        // default:
        //     console.log('error', action)
    }
    return state
}

export default influencerReducer