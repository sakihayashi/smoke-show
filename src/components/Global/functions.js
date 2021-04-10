export const numberWithCommas = (x) =>{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const urlify = (text) =>{
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url)=> {
        return '<a target="_blank" href="' + url + '">' + url + '</a><br>';
    })
}