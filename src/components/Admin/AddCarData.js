import React, { Fragment, useEffect, useState } from 'react'
import * as Realm from "realm-web"
import jwt from 'jsonwebtoken'

import LoginDiv from './LoginDiv'
import { Container, Button, Form, Col, Row, Alert } from 'react-bootstrap'
import ColorDiv from './colorDiv'
import ColorInterior from './colorInterior'
import FormText from './FormText'
import FormCheckbox from './FormCheckbox'
import { logInUser } from '../../store/actions/authActions'
import { connect } from 'react-redux'


const AddCarData = (props) =>{
    const [userObj, setUserObj] = useState({email: '', password: ''})
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const maxAgeTest = 1 * 60 * 60
    const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID })
    const [price, setPrice] = useState({baseMSRP: null, baseInvoice: null})
    const [powerFeatures, setPowerFeatures] = useState({})
    const [colorExterior, setColorExterior] = useState([{name: '', rgb: null}])
    const [colorInterior, setColorInterior] = useState([{name: '', rgb: null}])
    const [basicData, setBasicData] = useState({make: '', model: '', year: null, id: null, name: '', totalSeating: null })
    const [warranty, setWarranty] = useState({Basic: "", Drivetrain: "", Rust: "", Roadside: ""})
    const [isSaved, setIsSaved] = useState(false)
    const [measurements, setMeasurements] = useState({
        "Maximum cargo capacity": "",
        "Curb weight": "",
        "Cargo capacity, all seats in place": "",
        "Angle of approach": "",
        "Angle of departure": "",
        Length: "",
        "Ground clearance": "",
        Height: "",
        "Wheel base": "",
        Width: ""
    })
    const [fuel, setFuel] = useState({
        "Range in miles (cty/hwy)": "",
        "Fuel tank capacity": "",
        "Combined MPG": "",
        "Fuel type": ""
    })
    const [fuelMileage, setFuelMileage] = useState({
        "EPA mileage est": {
            "(cty/hwy)": ""
        }
    })
    const [engine, setEngine] = useState({
        Torque: "",
        "Base engine size": "",
        Horsepower: "",
        "Turning circle": "",
        Valves: "",
        "Base engine type": "",
        "Valve timing": "",
        "Cam type": "",
        Cylinders: ""
    })
    const [rearseats, setRearseats] = useState({})
    const [comfort, setComfort] = useState({})
    const [exteriorOptions, setExteriorOptions] = useState({})
    const [driveTrain, setDriveTrain] = useState({})
    const [suspension, setSuspension] = useState({})
    const [instrumentation, setInstrumentation] = useState({})
    const [entertainment, setEntertainment] = useState({})
    const [frontseats, setFrontseats] = useState({})
    const [safety, setSafety] = useState({})
    const [tires, setTires] = useState({})
    const [interiorOptions, setInteriorOptions] = useState({})
    const [carObj, setCarObj] = useState({
        id: null,
        name: '',
        make: '',
        model: '',
        year: null,
        totalSeating: null,
        typeCategories: {},
        price: {
            baseMSRP: null,
            baseInvoice: null
        },
        color: {
            EXTERIOR: [],
            INTERIOR: []
        },
        features: {
            "Power Feature": {
                "1 one-touch power windows": false,
                "remote keyless power door locks": false,
                "Heated mirrors": false
            },
            Rearseats: {
                "Rear head room": "",
                "Rear hip Room": "",
                "Rear leg room": "",
                "Rear shoulder room": "",
                "reclining rear seats": false,
                "Split-folding rear seatback": false,
                "folding center armrest": false
            },
            Warranty: {
                Basic: "",
                Drivetrain: "",
                Rust: "",
                Roadside: ""
            },
            Measurements: {
                "Maximum cargo capacity": "",
                "Curb weight": "",
                "Cargo capacity, all seats in place": "",
                "Angle of approach": "",
                "Angle of departure": "",
                Length: "",
                "Ground clearance": "",
                Height: "",
                "Wheel base": "",
                Width: ""
            },
            "Comfort & Convenience": {
                "Audio and cruise controls on steering wheel": false,
                "cruise control": false,
                "front and rear door pockets": false,
                "rear view camera": false,
                "tilt and telescopic steering wheel": false
            },
            "Exterior Options": {
                "Wheel Locks": false
            },
            "Drive Train": {
                "Drive type": "",
                Transmission: ""
            },
            Suspension: {
                "four-wheel independent suspension": false
            },
            Instrumentation: {
                clock: false,
                "trip computer": false,
                "tachometer": false
            },
            "In Car Entertainment": {
                "auxiliary audio input and USB with external media control": false,
                "USB connection": false,
                "AM/FM stereo": false,
                "6 total speakers": false
            },
            Frontseats: {
                "Front head room": "",
                "bucket front seats": false,
                "height adjustable driver seat": false,
                "Front shoulder room": "",
                "Front leg room": "",
                "4 -way manual passenger seat adjustment": false,
                "Front hip room": "",
                cloth: false
            },
            Fuel: {
                "EPA mileage est": {
                    "(cty/hwy)": ""
                },
                "Range in miles (cty/hwy)": "",
                "Fuel tank capacity": "",
                "Combined MPG": "",
                "Fuel type": ""
            },
            Safety: {
                "4-wheel ABS": false,
                "Rear door child safety locks": false,
                "Rear center 3-point belt": false,
                "child seat anchors": false,
                "dual front side-mounted airbags": false,
                "stability control": false,
                "Passenger airbag occupant sensing deactivation": false,
                "remote anti-theft alarm system": false,
                "2 front headrests": false,
                "3 rear headrests": false,
                "dusk sensing headlamps": false,
                "tire pressure monitoring": false,
                "traction control": false,
                "Ventilated front disc / solid rear disc brakes": false
//                 0: "Rear door child safety locks"
// 1: "daytime running lights"
// 2: "stability control"
// 3: "Passenger airbag occupant sensing deactivation"
// 4: "remote anti-theft alarm system"
// 5: "2 front headrests"
// 6: "tire pressure monitoring"
// 7: "traction control"
// 8: "4-wheel ABS"
// 9: "Rear center 3-point belt"
// 10: "child seat anchors"
// 11: "front and rear head airbags"
// 12: "dusk sensing headlamps"
// 13: "3 rear headrests"
// 14: "dual front side-mounted airbags"
// 15: "Ventilated front disc / solid rear disc brakes"
            },
            "Tires and Wheels": {
                "temporary spare tire": false,
                "All season tires": false,
            },
            Engine: {
                Torque: "",
                "Base engine size": "",
                Horsepower: "",
                "Turning circle": "",
                Valves: "",
                "Base engine type": "",
                "Valve timing": "",
                "Cam type": "",
                Cylinders: ""
            },
            "Interior Options": {
                "Carpet Floor Mats": false,
                "Interior Light Kit": false,
                "Cargo Mat": false
            }
        }
    })
    // console.log('obj', carObj.features['Comfort & Convenience'])
    const addDiv = () =>{
        setColorExterior(colorExterior=>[...colorExterior, {name: '', rgb: null}])
    }
    const addDivInterior = () =>{
        setColorInterior(colorInterior => [...colorInterior, {name: '', rgb: null}])
        console.log(colorInterior)
    }
        
    const changeColorExterior = (e, index) =>{
        let newArr = [...colorExterior]; // copying the old datas array
        newArr[index] = {...newArr[index], [e.target.name]: e.target.value} // 
        setColorExterior(newArr)
    }
    const changeColorInterior = (e, index) =>{
        let newArr = [...colorInterior]; // copying the old datas array
        newArr[index] = {...newArr[index], [e.target.name]: e.target.value} // 
        setColorInterior(newArr)
        console.log(colorInterior)
    }
    const handleChange = (e) =>[
        setUserObj({
            ...userObj,
            [e.target.name]: e.target.value
        })
    ]
    const changeBasicData = (e) =>{
        setBasicData({
            ...basicData,
            [e.target.name]: e.target.value
        })
    }
    const changePrice =(e)=>{
        setPrice({
            ...price,
            [e.target.name]: Number(e.target.value)
        })
    }
    const changeWarranty = (e)=>{
        setWarranty({
            ...warranty,
            [e.target.name]: e.target.value
        })
    }
    const changeMeasurements = (e) =>{
        setMeasurements({
            ...measurements,
            [e.target.name]: e.target.value
        })
    }
    const changeFuel = (e)=>{
        setFuel({
            ...fuel,
            [e.target.name]: e.target.value
        })
    }
    const changeFuelMileage = (e)=>{
        setFuelMileage({ 
            "(cty/hwy)": e.target.value
        })
    }
    const changeEngine = (e)=>{
        console.log('engine', engine)
        setEngine({
            ...engine,
            [e.target.name]: e.target.value
        })
    }
    const changePowerFeatures = (e) =>{
        if(e.target.checked === true){
            setPowerFeatures({
                ...powerFeatures,
                [e.target.name]: e.target.checked
            })
        }
    }
    const changeRearseats = (e) =>{
        if(e.target.checked){
            if(e.target.checked === true){
                setRearseats({
                    ...rearseats,
                    [e.target.name]: e.target.checked
                })
            }
        }else{
            setRearseats({
                ...rearseats,
                [e.target.name]: e.target.value
            })
        }
    }
    const changeComfort = (e) =>{
        if(e.target.checked === true){
            setComfort({
                ...comfort,
                [e.target.name]: e.target.checked
            })
        }
    }
    const changeExteriorOptions = (e) =>{
        if(e.target.checked === true){
            setExteriorOptions({
                ...exteriorOptions,
                [e.target.name]: e.target.checked
            })
        }
    }
    const changeDriveTrain = (e) =>{
        setDriveTrain({
            ...driveTrain,
            [e.target.name]: e.target.value
        })
    }
    const changeSuspension = (e) =>{
        setSuspension({
            ...suspension,
            [e.target.name]: e.target.value
        })
    }
    const changeInstrumentation = (e) =>{
        if(e.target.checked === true){
            setInstrumentation({
                ...instrumentation,
                [e.target.name]: e.target.checked
            })
        }
    }
    const changeFrontseats = (e)=>{
        if(e.target.checked){
            if(e.target.checked === true){
                setFrontseats({
                    ...frontseats,
                    [e.target.name]: e.target.checked
                })
            }
        }else{
            setFrontseats({
                ...frontseats,
                [e.target.name]: e.target.value
            })
        }
    }
    const changeSafety = (e) =>{
        if(e.target.checked === true){
            setSafety({
                ...safety,
                [e.target.name]: e.target.checked
            })
        }
    }
    const changeTires = (e) =>{
        if(e.target.checked === true){
            setTires({
                ...tires,
                [e.target.name]: e.target.checked
            })
        }
    }
    const changeInteriorOptions = (e) =>{
        if(e.target.checked === true){
            setInteriorOptions({
                ...interiorOptions,
                [e.target.name]: e.target.checked
            })
        }
    }
    const changeEntertainment = (e) =>{
        if(e.target.checked === true){
            setEntertainment({
                ...entertainment,
                [e.target.name]: e.target.checked
            })
        }
    }
    const handleSubmitLogin = async (e) =>{
        e.preventDefault()
        e.preventDefault()
        const emailLowerCase = userObj.email.toLowerCase()
        const credentials = Realm.Credentials.emailPassword(emailLowerCase, userObj.password)
        props.logInUser(credentials, emailLowerCase)
        
    }
    const handleSubmitData = async (e) =>{
        // e.preventDefault()
        setFuel({
            ...fuel,
            "EPA mileage est": fuelMileage
        })
        const carData = {
            isManual: true,
            id: basicData.id,
            name: basicData.name,
            make: basicData.make,
            model: basicData.model,
            year: Number(basicData.year),
            totalSeating: Number(basicData.totalSeating),
            price: price,
            color: {
                EXTERIOR: colorExterior,
                INTERIOR: colorInterior
            },
            features: {
                "Power Feature": powerFeatures,
                Rearseats: rearseats,
                Warranty: warranty,
                Measurements: measurements,
                "Comfort & Convenience": comfort,
                "Exterior Options": exteriorOptions,
                "Drive Train": driveTrain,
                Suspension: suspension,
                Instrumentation: instrumentation,
                "In Car Entertainment": entertainment,
                Frontseats: frontseats,
                Fuel: fuel,
                Safety: safety,
                "Tires and Wheels": tires,
                Engine: engine,
                "Interior Options": interiorOptions
            }
        }
        const mongo = app.currentUser.mongoClient(process.env.REACT_APP_REALM_SERVICE_NAME)
        const collection = mongo.db("smoke-show").collection("cars-manual")
        try{
            await collection.insertOne(carData).then(res =>{
                console.log('success!')
                setIsSaved(true)
            })
        }catch(err){
            console.log(err)
        }
    }
    useEffect(() => {
        if(props.isLoggedIn){
            setIsLoggedIn(true)
        }else{
            setIsLoggedIn(false)
        }
    }, [props.isLoggedIn])
    useEffect(() => {
        const token = sessionStorage.getItem('session_token')
        if(token){
            setIsLoggedIn(true)
        }else{
            setIsLoggedIn(false)
        }
    }, [])
    return(
        <Fragment>
            {isLoggedIn ?
            <Container>
            <div className="spacer-4rem"></div>
                <h1>Add New Car Data</h1>
                <div className="spacer-2rem"></div>
                <Form>
                    <Form.Group as={Row} >
                        <Form.Label column sm="4">
                        ID
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control type="number" pattern="\d*" placeholder="type number | leave blank if no data found" name="id" onChange={changeBasicData}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} >
                        <Form.Label column sm="4">
                        Name
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control type="text" placeholder="Name" name="name" onChange={changeBasicData}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm="4">
                        Make
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control type="text" placeholder="Maker" onChange={changeBasicData} name="make" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm="4">
                        Model
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control type="text" placeholder="Model" onChange={changeBasicData} name="model"/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm="4">
                        year
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control type="number" pattern="\d*" placeholder="Type number" onChange={changeBasicData} name="year" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm="4">
                        Price | base MSRP
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control type="number" pattern="\d*" placeholder="Type number" name="baseMSRP" onChange={changePrice}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm="4">
                        Price | base Invoice
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control type="number" pattern="\d*" placeholder="Type number" onChange={changePrice} name="baseInvoice" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm="4">
                        totalSeating
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control type="number" placeholder="Type number" onChange={changeBasicData} name="totalSeating"/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm="4">
                        Color | EXTERIOR <Button size="sm" onClick={addDiv}>add color</Button>
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control onChange={(e)=>changeColorExterior(e, 0)} name="name" type="text" placeholder="Name" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm="4">
                        Color EXTERIOR : RGB
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control type="text" pattern="\d*" placeholder="111,111,111" name="rgb" onChange={(e)=>changeColorExterior(e, 0)}  />
                        </Col>
                    </Form.Group>
                    {
                        colorExterior.map((exterior, index) =>{
                            return(
                                <ColorDiv num={index + 1} changeColorExterior={changeColorExterior} />
                            )
                            
                        })
                    }
                    <hr />
                    <Form.Group as={Row} >
                        <Form.Label column sm="4">
                        Color | Interior <Button size="sm" onClick={addDivInterior}>add color</Button>
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control onChange={(e)=>changeColorInterior(e, 0)} name="name" type="text" placeholder="Name" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm="4">
                        Color Interior : RGB
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control type="text" pattern="\d*" placeholder="111,111,111" name="rgb" onChange={(e)=>changeColorInterior(e, 0)}  />
                        </Col>
                    </Form.Group>
                    {
                        colorInterior.map((interior, index) =>{
                            return(
                                <ColorInterior changeColorInterior={changeColorInterior} num={index +1} />
                            )
                            
                        })
                    }
                    <hr/>
                    <h3>Features</h3>
                    <h3>Power Feature</h3>
                    {  
                        Object.keys(carObj.features['Power Feature']).map(key =>{
                        return <FormCheckbox objKey={key} handleChange={changePowerFeatures}/>
                    })}
                    <hr/>
                    <h3>Rearseats</h3>
                    { Object.keys(carObj.features.Rearseats).map(key=>{
                        if(carObj.features.Rearseats[key]=== false || carObj.features.Rearseats[key]=== true){
                            return <FormCheckbox objKey={key} handleChange={changeRearseats} />
                        }else{
                            return (<Fragment>
                                    <FormText objKey={key} handleChange={changeRearseats} />
                                    <hr/>
                                    </Fragment>)
                        }
                    })}
                    <h3>Warranty</h3>
                    {Object.keys(carObj.features.Warranty).map(key =>{
                        return <FormText objKey={key} handleChange={changeWarranty}/>
                    })}
                    <hr />
                    <h3>Measurements</h3>
                    {Object.keys(carObj.features.Measurements).map(key =>{
                        return <FormText objKey={key} handleChange={changeMeasurements} />
                    })}
                    <hr />
                    <h3>Comfort & Convenience</h3>
                    {  
                        Object.keys(carObj.features['Comfort & Convenience']).map(key =>{
                        return <FormCheckbox objKey={key} handleChange={changeComfort}/>
                    })}
                    <h3>Exterior Options</h3>
                    {  
                        Object.keys(carObj.features['Exterior Options']).map(key =>{
                        console.log(key)
                        return <FormCheckbox objKey={key} handleChange={changeExteriorOptions}/>
                    })}
                    <hr />
                    <h3>Drive Train</h3>
                    { Object.keys(carObj.features['Drive Train']).map(key =>{
                        return <FormText objKey={key} handleChange={changeDriveTrain} />
                    })
                    }
                    <hr />
                    <h3>Suspension</h3>
                    {  
                        Object.keys(carObj.features.Suspension).map(key =>{
                        console.log(key)
                        return <FormCheckbox objKey={key} handleChange={changeSuspension}/>
                    })}
                    <hr />
                    <h3>Instrumentation</h3>
                    {  
                        Object.keys(carObj.features.Instrumentation).map(key =>{
                        return <FormCheckbox objKey={key} handleChange={changeInstrumentation}/>
                    })}
                    <h3>In Car Entertainment</h3>
                    {  
                        Object.keys(carObj.features['In Car Entertainment']).map(key =>{
                        return <FormCheckbox objKey={key} handleChange={changeEntertainment}/>
                    })}
                    <h3>Frontseats</h3>
                    { Object.keys(carObj.features.Frontseats).map(key=>{
                        if(carObj.features.Frontseats[key]=== false || carObj.features.Frontseats[key]=== true){
                            return <FormCheckbox objKey={key} handleChange={changeFrontseats} />
                        }else{
                            return <Fragment>
                                    <FormText objKey={key} handleChange={changeFrontseats}/>
                                    <hr/>
                                    </Fragment>
                        }
                    })}
                    <h3>Fuel</h3>
                    <Form.Group as={Row} >
                        <Form.Label column sm="4">
                        EPA mileage est | (cty/hwy)
                        </Form.Label>
                        <Col sm="8">
                        <Form.Control type="text" placeholder="Type text" onChange={changeFuelMileage}/>
                        </Col>
                    </Form.Group>
                    { Object.keys(carObj.features.Fuel).map(key =>{
                        if(key === carObj.features.Fuel['EPA mileage est'] ){
                            return ''
                        }else{
                            return <FormText objKey={key} handleChange={changeFuel} />
                        }
                        
                    })
                    }
                    <hr/>
                    <h3>Safety</h3>
                    {  
                        Object.keys(carObj.features.Safety).map(key =>{
                        return <FormCheckbox objKey={key} handleChange={changeSafety}/>
                    })}
                    <hr />
                    <h3>Tires and Wheels</h3>
                    {  
                        Object.keys(carObj.features['Tires and Wheels']).map(key =>{
                        return <FormCheckbox objKey={key} handleChange={changeTires} />
                    })}
                    <h3>Engine</h3>
                    { Object.keys(carObj.features.Engine).map(key =>{
                        return <FormText objKey={key} handleChange={changeEngine} />
                    })
                    }
                    <hr />
                    <h3>Interior Options</h3>
                    {  
                        Object.keys(carObj.features['Interior Options']).map(key =>{
                        return <FormCheckbox objKey={key} handleChange={changeInteriorOptions}/>
                    })}
                    {isSaved && <Alert variant="success">Successfully saved!</Alert>}
                    <Button style={{margin:'4rem auto', width: '100%'}} onClick={handleSubmitData}>Save data</Button>
                </Form>
            </Container>
             : <LoginDiv handleSubmitLogin={handleSubmitLogin} handleChange={handleChange} />}
        </Fragment>
    )
}
const mapDispatchToProps = (dispatch) =>{
    return {
        logInUser: (credentials, email) => dispatch(logInUser(credentials, email))
    }
}
const mapStateToProps = (state) => {
    //syntax is propName: state.key of combineReducer.key
    return{
        isLoggedIn: state.auth.isLoggedIn
    }
  }
export default connect(mapStateToProps, mapDispatchToProps)(AddCarData)