import React, { Fragment, useEffect, useState } from 'react'
import * as Realm from "realm-web"
import jwt from 'jsonwebtoken'

import LoginDiv from './LoginDiv'
import { Container, Button, Form, Col, Row } from 'react-bootstrap'
import ColorDiv from './colorDiv'
import ColorInterior from './colorInterior'
import FormText from './FormText'
import FormCheckbox from './FormCheckbox'

const AddCarData = () =>{
    const [userObj, setUserObj] = useState({email: '', password: ''})
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const maxAgeTest = 1 * 60 * 60
    const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID })
    const [price, setPrice] = useState({baseMSRP: null, baseInvoice: null})
    const [powerFeatures, setPowerFeatures] = useState({})
    const [colorExterior, setColorExterior] = useState([{name: '', rgb: null}])
    const [colorInterior, setColorInterior] = useState([{name: '', rgb: null}])
    const [basicData, setBasicData] = useState({make: '', model: '', year: null, id: null, name: '', totalSeating: null, })
    const [carObj, setCarObj] = useState({
        id: null,
        name: '',
        price: {
            baseMSRP: null,
            baseInvoice: null
        },
        totalSeating: null,
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
        },
        make: '',
        model: '',
        year: null,
        typeCategories: {}
    })
    console.log('obj', carObj.features['Comfort & Convenience'])
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
            [e.target.name]: e.target.value
        })
    }
    const handleSubmitLogin = async (e) =>{
        e.preventDefault()
        const emailLowerCase = userObj.email.toLowerCase()
        const credentials = Realm.Credentials.emailPassword(emailLowerCase, userObj.password)
        try{
            app.logIn(credentials).then( user =>{
                setIsLoggedIn(true)
                const customData = user.customData
                const token = jwt.sign({ userData: customData }, process.env.REACT_APP_JWT_SECRET, {expiresIn: maxAgeTest})
                sessionStorage.setItem('session_token', token)
         
                })
        }catch(err){
            console.log(err)
        }
        
    }
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
                        return <FormCheckbox objKey={key} />
                    })}
                    <hr/>
                    <h3>Rearseats</h3>
                    { Object.keys(carObj.features.Rearseats).map(key=>{
                        if(carObj.features.Rearseats[key]=== false || carObj.features.Rearseats[key]=== true){
                            return <FormCheckbox objKey={key} />
                        }else{
                            return <Fragment>
                                    <FormText objKey={key} />
                                    <hr/>
                                    </Fragment>
                        }
                    })}
                    <h3>Warranty</h3>
                    {Object.keys(carObj.features.Warranty).map(key =>{
                        return <FormText objKey={key} />
                    })}
                    <hr />
                    <h3>Measurements</h3>
                    {Object.keys(carObj.features.Measurements).map(key =>{
                        return <FormText objKey={key} />
                    })}
                    <hr />
                    <h3>Comfort & Convenience</h3>
                    {  
                        Object.keys(carObj.features['Comfort & Convenience']).map(key =>{
                        console.log(key)
                        return <FormCheckbox objKey={key} />
                    })}
                    <h3>Exterior Options</h3>
                    {  
                        Object.keys(carObj.features['Exterior Options']).map(key =>{
                        console.log(key)
                        return <FormCheckbox objKey={key} />
                    })}
                    <hr />
                    <h3>Drive Train</h3>
                    { Object.keys(carObj.features['Drive Train']).map(key =>{
                        return <FormText objKey={key} />
                    })
                    }
                    <hr />
                    <h3>Suspension</h3>
                    {  
                        Object.keys(carObj.features.Suspension).map(key =>{
                        console.log(key)
                        return <FormCheckbox objKey={key} />
                    })}
                    <hr />
                    <h3>Instrumentation</h3>
                    {  
                        Object.keys(carObj.features.Instrumentation).map(key =>{
                        return <FormCheckbox objKey={key} />
                    })}
                    <h3>In Car Entertainment</h3>
                    {  
                        Object.keys(carObj.features['In Car Entertainment']).map(key =>{
                        return <FormCheckbox objKey={key} />
                    })}
                    <h3>Frontseats</h3>
                    { Object.keys(carObj.features.Frontseats).map(key=>{
                        if(carObj.features.Frontseats[key]=== false || carObj.features.Frontseats[key]=== true){
                            return <FormCheckbox objKey={key} />
                        }else{
                            return <Fragment>
                                    <FormText objKey={key} />
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
                        <Form.Control type="text" placeholder="Type text" />
                        </Col>
                    </Form.Group>
                    { Object.keys(carObj.features.Fuel).map(key =>{
                        if(key === carObj.features.Fuel['EPA mileage est'] ){
                            return ''
                        }else{
                            return <FormText objKey={key} />
                        }
                        
                    })
                    }
                    <hr/>
                    <h3>Safety</h3>
                    {  
                        Object.keys(carObj.features.Safety).map(key =>{
                        return <FormCheckbox objKey={key} />
                    })}
                    <hr />
                    <h3>Tires and Wheels</h3>
                    {  
                        Object.keys(carObj.features['Tires and Wheels']).map(key =>{
                        return <FormCheckbox objKey={key} />
                    })}
                    <h3>Engine</h3>
                    { Object.keys(carObj.features.Engine).map(key =>{
                        return <FormText objKey={key} />
                    })
                    }
                    <hr />
                    <h3>Interior Options</h3>
                    {  
                        Object.keys(carObj.features['Interior Options']).map(key =>{
                        return <FormCheckbox objKey={key} />
                    })}
                    
                </Form>
            </Container>
             : <LoginDiv handleSubmitLogin={handleSubmitLogin} handleChange={handleChange} />}
        </Fragment>
    )
}

export default AddCarData