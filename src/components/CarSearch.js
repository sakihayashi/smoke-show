import React, { Fragment, useState, useEffect  } from 'react'
import { Dropdown, DropdownButton, Button } from 'react-bootstrap'
import Layout from './Layout/Layout'
import * as Realm from "realm-web"
import { carsAllYear } from './carTempData'
import './carStats.scss'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
// import MediaNet from '../components/MediaNet'

const CarSearch = (props) =>{
    const [modelName, setModelName] = useState([])
    const [selectedCar, setSelectedCar] = useState({make: "Select a maker", model: "Select a model", type: "Select a type", year: "Select a year"})
    const [carTypeArr, setCarTypeArr] = useState([])
    const [carYearArr, setCarYearArr] = useState([])
    const [mongo, setMongo] = useState()
    const [cars, setCars] = useState([])
    const [carsByModel, setCarsByModel] = useState([])
    const [carsByYear, setCarsByYear] = useState([])
    const [carResults, setCarResults] = useState([])
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
      };
    const app = new Realm.App(appConfig)
    // const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
    // const [carMakers, setCarMakers] = useState([])
    const searchId = uuidv4()


    const getModel = async (e) =>{
        setModelName([])
        setSelectedCar({ make: e, model: "Select a model", type: "Select a type", year: "Select a year"})
        // let carModelArr = []
        const mongoCollection = mongo.db("smoke-show").collection("cars")
        const makeLowerCase = e.toLowerCase()
        const filter = {make: makeLowerCase} 
        try{
            await mongoCollection.find(filter).then(cars =>{
                // const carModelArr = [...new Set(availableTypes)]
                let carModelArr = cars.map(car =>{
                             return car.model
                          })
                const unique = [...new Set(carModelArr)]
                  setModelName(unique.sort())
                  setCars(cars)
                  setCarResults(cars)
              })
        }catch(err){console.log(err)}
        
    }
    const getCarYear = (data) =>{
        let yearArr = []
        data.map(car =>{
            if(yearArr.includes(car.year) === false){
                yearArr.push(car.year)
            }
        })
        setCarYearArr(yearArr.sort())
    }
    const filterByModel = (e) =>{
        
        setSelectedCar({...selectedCar, model: e, type: "Select a type", year: "Select a year"})
        let filteredByModel = cars.filter(function (car) {
            if(car.model === e){
                return car
            }
        });
        // setCars(filteredByModel)
        setCarsByModel(filteredByModel)
        setCarResults(filteredByModel)
        getCarYear(filteredByModel)
        
    }
    const getModelNames = (data) =>{
        
        const regCarTypes = /Sedan|Coupe|SUV|Minivan|Wagon|Sport|Station Wagon|Hatchback|Truck/i
        let availableTypes = data.map(car =>{
          const result = car.name.match(regCarTypes) 
          if(result){
              return result[0]
              
          }
          
        })
        const finalResult = [...new Set(availableTypes)]
        setCarTypeArr(finalResult.sort())

    }
    const filterByYear = (e) =>{
        setSelectedCar({...selectedCar, year: e, type: "Select a type"})
        let filteredByYear = carsByModel.filter((car) =>{
            if(car.year == e){
                return car
            }
        })
        setCarsByYear(filteredByYear)
        setCarResults(filteredByYear)
        getModelNames(filteredByYear)
    }

    const filterByType = (e) =>{
       
        setSelectedCar({...selectedCar, type: e})
        let filtered =  carsByYear.filter(car => car.name.includes(e))
        setCarResults(filtered)
    }
   const goStatsPage = () =>{
      
       sessionStorage.setItem(searchId, carResults)
       props.history.push({
        pathname: `/car-stats/${searchId}`,
        cars: carResults,
        selected: selectedCar
      })
   }
   const checkToken = async () =>{
    // let token = sessionStorage.getItem('session_token')
    const tokenUser = sessionStorage.getItem('session_user')
    if(tokenUser){
        jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET, async (err, decoded)=>{
            if(err){
                console.log(err)
                const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW)
                try{
                    await app.logIn(credentials).then(  user =>{
                        const mongoClient = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                        setMongo(mongoClient)
                    })
                }catch(err){
                    console.log(err)
                }
            }else{
                // const credentials = jwt.verify(tokenUser, process.env.REACT_APP_JWT_SECRET)
             
                try{
                    await app.logIn(decoded.cre).then( user =>{
                        const mongoClient = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                        setMongo(mongoClient)
                    })
                }catch(err){
                    console.log(err)
                }
            }
        });
        
     }else{
        const credentials = Realm.Credentials.apiKey(process.env.REACT_APP_REALM_AUTH_PUBLIC_VIEW);
        try{
            await app.logIn(credentials).then(  user =>{
                const mongoClient = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
                setMongo(mongoClient)
            })
        }catch(err){
            console.log(err)
        }
     }
   }
   useEffect(() => {
    checkToken()
   }, [])
    return(
        <Layout>
            <div className="spacer-4rem"></div>
            <div className="main-wrapper main-height" style={{minHeight: 'calc(100vh - 21rem)'}}>
            
                <div className="search-wrapper" >
                    <div className="center-box">
                    {/* maker */}
                    <DropdownButton id="dropdown-brand" title={selectedCar.make} onSelect={getModel} className="custom-dropdown">
                        { carsAllYear && carsAllYear.map((maker, index) =>{
                            const titleCase = maker.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                            return(
                                <Fragment key={maker +index}>
                                    <Dropdown.Item  eventKey={titleCase} >
                                    <img src={require(`../assets/maker_logos/${titleCase}_Logo.png`).default} alt={titleCase} className="maker-img"/>
                                    {titleCase}
                                    </Dropdown.Item>
                                </Fragment>
                            )
                        })}
                    </DropdownButton>
                    </div>
                    
                    <div className="center-box">
                    {/* model */}
                        <DropdownButton id="dropdown-year" title={selectedCar.model} onSelect={filterByModel} className="dropdown-middle">
                            {modelName.map((model, index) =>{
                                const titleCase = model.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
                                return(
                                    <Fragment key={model +index}>
                                        <Dropdown.Item eventKey={model} >{titleCase}</Dropdown.Item>
                                    </Fragment>
                                )
                            })}
                        </DropdownButton>
                    </div>
                    <div className="center-box">
                    {/* year */}
                        <DropdownButton id="dropdown-model" title={selectedCar.year} onSelect={filterByYear}>
                            {carYearArr.map(year =>{
                                const uuid = uuidv4()
                                return(
                                    <Fragment key={uuid} >
                                        <Dropdown.Item eventKey={year} >{year}</Dropdown.Item>
                                    </Fragment>
                                )
                            })}
                        </DropdownButton>
                    </div>
                    <div className="center-box">
                        <DropdownButton id="dropdown-type" title={selectedCar.type} onSelect={filterByType} >
                            { carTypeArr && carTypeArr.map((type, index) =>{
                                return(
                                    <Fragment key={type +index}>
                                        <Dropdown.Item eventKey={type} >{type}</Dropdown.Item>
                                    </Fragment>
                                )
                                
                                
                            })}
                        </DropdownButton>
                    </div>
                    
                    <div className="center-box">
                        <Button className="search-btn" onClick={goStatsPage}>Search</Button>
                    </div>
                    
                </div>

                {/* <div className="ad-on-search">
            
                </div> */}
            </div>
            
        </Layout>
    )
}

export default CarSearch