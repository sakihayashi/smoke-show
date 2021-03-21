import React from 'react'

const VideoDiv = (props) =>{
    const videoEmbedURL = 'https://www.youtube.com/embed/'
    const {videoId, video } = props
    return(
        <div className="videoWrapper">
            <iframe 
            src={videoEmbedURL + videoId}
            loading="lazy"
            frameBorder='0'
            width="560" 
            height="315"
            // allow='autoplay; encrypted-media'
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            title={`${video.snippet.title} | The Smoke Show`}
            />

        </div>
    )
}

export default VideoDiv