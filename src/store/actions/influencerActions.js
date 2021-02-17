import * as Realm from "realm-web"
import jwt from 'jsonwebtoken'

const appConfig = {
    id: process.env.REACT_APP_REALM_APP_ID,
    // timeout: 10000, 
    // timeout in number of milliseconds
  };
const app = new Realm.App(appConfig);
const maxAgeTest = 1 * 60 * 60

export const getInfluencer = (influencerId) =>{
    let formattedFans
    return(dispatch, getState)=>{
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collectionInfluencer = mongo.db("smoke-show").collection("influencers")
        const filter = {userId: influencerId}
        collectionInfluencer.findOne(filter).then(influencer =>{
            if(influencer.fans > 999){
                formattedFans = Math.sign(influencer.fans)*((Math.abs(influencer.fans)/1000).toFixed(1)) + 'k'
            }else{
                formattedFans = Math.sign(influencer.fans)*Math.abs(influencer.fans)
            }
            dispatch({type: 'GET_INFLUENCER', influencer, formattedFans})
        }).catch(err =>{
            console.log(err)
            dispatch({type: 'NO_INFLUENCER'})
        })
    }
}
