
//get video length API
const { getVideoDurationInSeconds } = require('get-video-duration')

exports.getVideoLengthInMinutes = async (video) =>{
try{
    const videoLengthInSeconds = await getVideoDurationInSeconds(video)
    return (videoLengthInSeconds * 60)
}
catch(err){
    throw new Error("error getting video duration")
}
}
