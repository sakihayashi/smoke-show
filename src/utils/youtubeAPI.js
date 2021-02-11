import axios from 'axios'

// const YouTubeKey = 'AIzaSyCNBPDjL805pTu3F9FylWEhpA5Vw7XtG9s'
const YouTubeKey = process.env.REACT_APP_YOUTUBE_KEY


const youtubeAPI = axios.create({
    baseURL: ' https://www.googleapis.com/youtube/v3',
    params: {
        part: 'snippet',
        maxResults: 2,
        key: YouTubeKey
    }
})


export{
    youtubeAPI
}