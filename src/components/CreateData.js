import React from 'react'
import * as Realm from "realm-web"
import { Button } from 'react-bootstrap'

import { cars1990, cars1991, cars1992, cars1993, cars1994, cars1995, cars1996, cars1997, cars1998, cars1999, cars2000, cars2001, cars2002, cars2003, cars2004, cars2005, cars2006, cars2007, cars2008, cars2009, cars2010, cars2011, cars2012, cars2013, cars2014, cars2015, cars2016, cars2017, cars2018, cars2019, cars2020, cars2021} from './carTempData'

const CreateData = () =>{
    let modelArr = []
    const getData = async () =>{
        const credentials = Realm.Credentials.emailPassword('saki@thehoongroup.com', 'aaaaaa')
        const appConfig = {
            id: process.env.REACT_APP_REALM_APP_ID,
          };
        const app = new Realm.App(appConfig)
        let finalResult = []
        // let cars2021 = [], cars2020 = [], cars2019 = [], cars2018 = [], cars2017 = [], cars2016 = [], cars2015 = [], cars2014 = [], cars2013 = [], cars2012 = [], cars2011 = [], cars2010 = [], cars2009 = [], cars2008 = [], cars2007 = [], cars2006 = [], cars2005 = [], cars2004 = [], cars2003 = [], cars2002 = [], cars2001 = [], cars2000 = [], cars1999 = [], cars1998 = [], cars1997 = [], cars1996 = [], cars1995 = [], cars1994 = [], cars1993 = [], cars1992 = [], cars1991 = [], cars1990 = []

        try {
      
          // an authenticated user is required to access a MongoDB instance
          await app.logIn(credentials).then( async user =>{
            const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
            const mongoCollection = mongo.db("smoke-show").collection("cars");
            let carsUpto2000 = []
            const filter = {year: 1990, year: 1991, year: 1992, year: 1993, year: 1994, year: 1995, year: 1996, year: 1997, year: 1998, year: 1999, year: 2000, year: 2001, year: 2002, year: 2003, year: 2004, year: 2005, year: 2006, year: 2007, year: 2008, year: 2009} 
            const option = {sort: {make: 1}}
            await mongoCollection.find(filter, option).then(cars =>{
                console.log('length', cars.length)
                cars.map(car =>{
                    if (carsUpto2000.includes(car.make) === false) carsUpto2000.push(car.make);
                    return carsUpto2000
                })
                console.log('carsUpto2000', carsUpto2000)
            })
            const filter2 = {year: 2010, year: 2011, year: 2012, year: 2013, year: 2014, year: 2015, year: 2016, year: 2017, year: 2018, year: 2019, year: 2020, year: 2021}
            let carsUpto2021 = []
            await mongoCollection.find(filter2, option).then(cars =>{
                console.log('length', cars.length)
                cars.map(car =>{
                    if (carsUpto2021.includes(car.make) === false) carsUpto2021.push(car.make);
                    return carsUpto2021
                })
                console.log('carsUpto2021', carsUpto2021)
            })
    
          }
          )
          
         }catch(error){console.log(error)}
    }
    const createData = () =>{
        const all = cars1990.concat(cars1991).concat(cars1992).concat(cars1993).concat(cars1994).concat(cars1995).concat(cars1996).concat(cars1997).concat(cars1998).concat(cars1999).concat(cars2000).concat(cars2001).concat(cars2002).concat(cars2003).concat(cars2004).concat(cars2005).concat(cars2006).concat(cars2007).concat(cars2008).concat(cars2009).concat(cars2010).concat(cars2011).concat(cars2012).concat(cars2013).concat(cars2014).concat(cars2015).concat(cars2016).concat(cars2017).concat(cars2018).concat(cars2019).concat(cars2020).concat(cars2021)
        console.log('all', all)
        const finalResult = [...new Set(all)];
        console.log('result', finalResult.sort())
}
    return(
        <div>
            <Button onClick={getData}>Click to create</Button>
            <Button onClick={createData}>Click to compare</Button>
        </div>
    )
}

export default CreateData