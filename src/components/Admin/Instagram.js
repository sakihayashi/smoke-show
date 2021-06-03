import React from 'react'
import FacebookLogin from 'react-facebook-login';


const Instagram = () =>{

    const responseFacebook = (response) =>{
        console.log('response', response)
    }
    return(
        <div>
            <FacebookLogin 
            appId="485978269408371"
            autoLoad={true}
            fields="name,email,picture"
            // onClick={componentClicked}
            callback={responseFacebook} 
            />
        </div>
    )
}

export default Instagram