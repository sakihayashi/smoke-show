import React, { useState } from 'react'
import * as Realm from "realm-web"
import { Button } from 'react-bootstrap'

const CheckCarData = () =>{
    const [cars, setCars] = useState([])
    const [safety, setSafety] = useState([])
    // const field = features['Safety']
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
        // timeout in number of milliseconds
      };
    const app = new Realm.App(appConfig);
    const maxAgeTest = 1 * 60 * 60
    const credentials = Realm.Credentials.emailPassword('saki@thehoongroup.com', 'aaaaaa')
    const queryData = async () =>{
        try{
            await app.logIn(credentials).then( async user =>{
                const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
                const mongoCollection = mongo.db("smoke-show").collection("cars");
                const filter = {make: 'bentley'}
                let tempArr = []
                await mongoCollection.find(filter).then(cars =>{
                    // console.log('cars', cars)
                    
                    cars.map(car =>{
                        const category = car.features['Comfort & Convenience']
                        console.log('log', category)
                        if(typeof(category) !== 'undefined'){
                            Object.keys(category).map(key=>{
                                tempArr.push(key)
                            })
                            
                            // return Object.keys(car.features['Safety'])
                            // console.log('checking', Object.keys(car.features['Safety']))
                        }
                        
                 
                        
                    })
                    console.log('temp', tempArr)
                   
                    return tempArr
                }).then( async arr =>{
                    let unique = [...new Set(arr)]
                    const insertData = {
                        // make: 'kia',
                        powerFeatureArr: unique
                    }
                    console.log('log', unique); 
                    const collectionDataAnalysis = mongo.db("smoke-show").collection("cars-data-analysis");
                    collectionDataAnalysis.updateOne(
                        { make: "bentley" },
                        { $set: { comfortArr: unique } },
                        { upsert: true }
                    ).then(res =>{
                        console.log(res)
                    })
                })
            })
        }catch(err){
            console.log(err)
        }
    }
    return(
        <div>

            <Button onClick={queryData}>Check car data</Button>
            {console.log(safety)}
        {safety && 
        Object.keys(safety).map((key, index) =>{
            return <p key={index}>{key}</p>
        })
        }
        </div>
    )
}

export default CheckCarData