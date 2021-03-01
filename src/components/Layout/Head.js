import React from 'react'
import {Helmet} from "react-helmet"
import xHeight from '../../fonts/X-Heighting400.ttf'
import bestInClass from '../../fonts/BEST-IN-CLASS.ttf'

const Head = () =>{
    return(
        <Helmet>
            <link rel="preload" href={xHeight} as="font" />
            <link rel="preload" href={bestInClass} as="font" />
   
            {/* <script type="text/javascript">
                window._mNHandle = window._mNHandle || {};
                window._mNHandle.queue = window._mNHandle.queue || [];
                medianet_versionId = "3121199";
            </script>
            <script src="https://contextual.media.net/dmedianet.js?cid=8CU1IBHU4" async="async"></script> */}
        </Helmet>
    )
}

export default Head