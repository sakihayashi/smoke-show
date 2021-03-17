import React from 'react'

const VideoDiv = (props) =>{
    const videoEmbedURL = 'https://www.youtube.com/embed/'
    const {videoId, video } = props
    return(
        <div className="videoWrapper">
            <iframe src={videoEmbedURL + videoId}
            loading="lazy"
            frameBorder='0'
            width="560" 
            height="315"
            // allow='autoplay; encrypted-media'
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            // srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/${videoId}?autoplay=encrypted-media><img src=https://img.youtube.com/vi/${videoId}/hqdefault.jpg alt=${video.snippet.title}><span>▶</span></a>`}
            title={video.snippet.title}
            />

        </div>
    )
}

export default VideoDiv