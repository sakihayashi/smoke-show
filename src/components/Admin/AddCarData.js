import React, { Fragment, useEffect, useState } from 'react'
import * as Realm from "realm-web"
import jwt from 'jsonwebtoken'

import LoginDiv from './LoginDiv'
import { Container, Button, Form, Col, Row, InputGroup, FormControl } from 'react-bootstrap'

const AddCarData = () =>{
    const [userObj, setUserObj] = useState({email: '', password: ''})
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const maxAgeTest = 1 * 60 * 60
    const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID })
    const [price, setPrice] = useState({baseMSRP: null, baseInvoice: null})
    const [powerFeatures, setPowerFeatures] = useState({})
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
    const handleChange = (e) =>[
        setUserObj({
            ...userObj,
            [e.target.name]: e.target.value
        })
    ]
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
                        <Form.Label column sm="2">
                        ID
                        </Form.Label>
                        <Col sm="10">
                        <Form.Control type="number" placeholder="type number | leave blank if no data found" />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} >
                        <Form.Label column sm="2">
                        Name
                        </Form.Label>
                        <Col sm="10">
                        <Form.Control type="text" placeholder="Name" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm="2">
                        Price | base MSRP
                        </Form.Label>
                        <Col sm="10">
                        <Form.Control type="number" placeholder="Name" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm="2">
                        Price | base Invoice
                        </Form.Label>
                        <Col sm="10">
                        <Form.Control type="number" placeholder="Name" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm="2">
                        totalSeating
                        </Form.Label>
                        <Col sm="10">
                        <Form.Control type="number" placeholder="Name" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} >
                        <Form.Label column sm="2">
                        Color | EXTERIOR
                        </Form.Label>
                        <Col sm="10">
                        <Form.Control type="number" placeholder="Name" />
                        </Col>
                    </Form.Group>
                </Form>
            </Container>
             : <LoginDiv handleSubmitLogin={handleSubmitLogin} handleChange={handleChange} />}
        </Fragment>
    )
}

export default AddCarData