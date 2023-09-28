//get video length API
const { getVideoDurationInSeconds } = require("get-video-duration");

exports.getVideoLengthInMinutes = async (videoArray) => {
  try {
    // console.log({videoArray})
    let totalVideosLength = 0;
    videoArray.forEach(async (video) => {
      const videoLengthInSeconds = await getVideoDurationInSeconds(video.path); //get duration for each video in the array
      console.log({videoLengthInSeconds})
      totalVideosLength = totalVideosLength + videoLengthInSeconds;
    });
    console.log({totalVideosLength}, '4')
    return (totalVideosLength * 60);
  } catch (err) {
    throw new Error(err);
  }
};
