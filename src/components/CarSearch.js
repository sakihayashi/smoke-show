import React, { Fragment, useState  } from 'react'
import { Dropdown, DropdownButton, Button } from 'react-bootstrap'
import Layout from './Layout/Layout'
import * as Realm from "realm-web"
import { carsAllYear, carTypes } from './carTempData'
import './carStats.scss'
import { v4 as uuidv4 } from 'uuid';

const CarSearch = (props) =>{
    const [modelName, setModelName] = useState([])
    const [selectedCar, setSelectedCar] = useState({make: "Select a maker", model: "Select a model", type: "Select a type", year: "Select a year"})
    const [carTypeArr, setCarTypeArr] = useState([])
    const [carYearArr, setCarYearArr] = useState([])
    const credentials = Realm.Credentials.emailPassword('saki@thehoongroup.com', 'aaaaaa')
    const [cars, setCars] = useState([])
    const appConfig = {
        id: process.env.REACT_APP_REALM_APP_ID,
        // timeout: 10000, 
      };
    const app = new Realm.App(appConfig)
    const [carMakers, setCarMakers] = useState([])
    const searchId = uuidv4()

    const getMaker = async () =>{
        try {
            // an authenticated user is required to access a MongoDB instance
            await app.logIn(credentials).then( async user =>{
              const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
              let carMakerArr = []
              const mongoCollection = mongo.db("smoke-show").collection("cars");
            //   const filter = {make: 'aston-martin'} 
              await mongoCollection.find().then(cars =>{
                  cars.map(car =>{
                      if (carMakerArr.includes(car.make) === false) carMakerArr.push(car.make);
                  })
                  setCarMakers(carMakerArr)
                  
                  console.log('checkarr',carMakerArr)
              })
             
            })
            
           }catch(error){console.log(error)}
    }
    const getModel = async (e) =>{
        setSelectedCar({...selectedCar, make: e})
        let carModelArr = []
        try {
            await app.logIn(credentials).then( async user =>{
              const mongo = user.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME);
              const mongoCollection = mongo.db("smoke-show").collection("cars");
              const makeLowerCase = e.toLowerCase()
              const filter = {make: makeLowerCase} 
              await mongoCollection.find(filter).then(cars =>{
                  cars.map(car =>{
                      if (carModelArr.includes(car.model) === false) carModelArr.push(car.model);
                  })
                  
                  setModelName(carModelArr.sort())
                  setCars(cars)
              })
             
            })
            
           }catch(error){console.log(error)}
        
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
        setSelectedCar({...selectedCar, model: e})
        let filteredByModel = cars.filter(function (car) {
            if(car.model === e){
                return car
            }
        });

        setCars(filteredByModel)
        getCarYear(filteredByModel)
        console.log('data', filteredByModel)
        
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
        setSelectedCar({...selectedCar, year: e})
        let filteredByYear = cars.filter((car) =>{
            if(car.year == e){
                return car
            }
        })
        setCars(filteredByYear)
        getModelNames(filteredByYear)
    }

    const filterByType = (e) =>{
       
        setSelectedCar({...selectedCar, type: e})
     
        let filtered =  cars.filter(car => car.name.includes(e))
        console.log('filtered', filtered)
        setCars(filtered)
    }
   const goStatsPage = () =>{
       console.log('selected cars', selectedCar)
       sessionStorage.setItem(searchId, cars)
       props.history.push({
        pathname: `/car-stats/${searchId}`,
        cars: cars,
        selected: selectedCar
      })
   }

    return(
        <Layout>
            <div className="spacer-4rem"></div>
            <div className="main-wrapper" style={{minHeight: 'calc(100vh - 21rem)'}}>
            
                <div className="search-wrapper" >
                    <div className="center-box">
                    {/* maker */}
                    <DropdownButton id="dropdown-brand" title={selectedCar.make} onSelect={getModel} className="custom-dropdown">
                        { carsAllYear && carsAllYear.map((maker, index) =>{
                            const titleCase = maker.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                            return(
                                <Fragment key={maker}>
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
                            {modelName.map(model =>{
                                return(
                                    <Fragment key={model}>
                                        <Dropdown.Item eventKey={model} >{model}</Dropdown.Item>
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
                            { carTypeArr && carTypeArr.map(type =>{
                                return(
                                    <Fragment key={type}>
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

                
            </div>
        
        </Layout>
    )
}

export default CarSearch