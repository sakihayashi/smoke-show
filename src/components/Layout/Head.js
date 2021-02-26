import React from 'react'
import {Helmet} from "react-helmet"
import xHeight from '../../fonts/X-Heighting400.ttf'
import bestInClass from '../../fonts/BEST-IN-CLASS.ttf'

const Head = () =>{
    return(
        <Helmet>
            <link rel="preload" href={xHeight} as="font" />
            <link rel="preload" href={bestInClass} as="font" />
        </Helmet>
    )
}

export default Head