const { getVideoDurationInSeconds } = require("get-video-duration");

exports.getVideoLengthInMinutes = async (videoArray) => {
  try {
    let totalLengthInSeconds = 0;
    // Create an array of promises to fetch video durations asynchronously
    const durationPromises = [];
    for (const video of videoArray) {
      durationPromises.push(getVideoDurationInSeconds(video.path));
    }
    
    const durationsInSeconds = await Promise.all(durationPromises);// Waiting for all promises to resolve
    for (const duration of durationsInSeconds) {
      totalLengthInSeconds += duration;
    }

    // Calculate total length in minutes
    const totalLengthInMinutes = totalLengthInSeconds / 60;
    return totalLengthInMinutes.toFixed(2) + ' minutes';
  } catch (err) {
    throw new Error(err);
  }
};
