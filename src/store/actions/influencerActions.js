import * as Realm from "realm-web"
import jwt from 'jsonwebtoken'

const appConfig = {
    id: process.env.REACT_APP_REALM_APP_ID,
    // timeout: 10000, 
    // timeout in number of milliseconds
  };
const app = new Realm.App(appConfig);
// const maxAgeTest = 1 * 60 * 60

export const getInfluencer = (influencerId) =>{
    let formattedFans
    return(dispatch, getState)=>{
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionInfluencer = mongo.db("smoke-show").collection("influencers")
        const filter = {userId: influencerId}
        collectionInfluencer.findOne(filter).then(influencer =>{
            const collectionFans = mongo.db("smoke-show").collection(`fans-${influencer.username}`)
            collectionFans.count().then(num =>{
                if(num > 999){
                    return formattedFans = Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k'
                }else{
                    return formattedFans = Math.sign(num)*Math.abs(num)
                }
            }).then(formattedFans =>{
                const data = {user: influencer, numOfFans: formattedFans}
                dispatch({type: 'GET_INFLUENCER', data})
            })
            
        }).catch(err =>{
            console.log(err)
            dispatch({type: 'NO_INFLUENCER'})
        })
    }
}
