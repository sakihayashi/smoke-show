import axios from 'axios'

// const YouTubeKey = 'AIzaSyCNBPDjL805pTu3F9FylWEhpA5Vw7XtG9s'
const YouTubeKey = 'AIzaSyAJ8i-P2RLWLZo_bNbl5ZWdSw68rOQaBeU'


const youtubeAPI = axios.create({
    baseURL: ' https://www.googleapis.com/youtube/v3',
    params: {
        part: 'snippet',
        maxResults: 5,
        key: YouTubeKey
    }
})


export{
    youtubeAPI
}