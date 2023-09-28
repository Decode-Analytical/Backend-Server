//get video length API
const { getVideoDurationInSeconds } = require("get-video-duration");

exports.getVideoLengthInMinutes = async (videoArray) => {
  try {
    const videoLengthInSeconds = await getVideoDurationInSeconds(videoArray[0].path); //get duration for each video in the array
    return videoLengthInSeconds / 60;
  } catch (err) {
    throw new Error(err);
  }
};
