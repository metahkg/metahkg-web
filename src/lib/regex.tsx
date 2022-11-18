export const regex = {
    twitter: [/^https:\/\/(|mobile.)twitter.com\/\S+\/status\/\S+$/i],
    instagram: [/^https:\/\/(www|m)\.instagram\.com\/p\/\S+$/i],
    facebook: {
        posts: [/^https:\/\/(www|m)\.facebook\.com\/\S+\/posts\/\S+$/i],
        videos: [
            /^https:\/\/(www|m)\.facebook\.com\/.+\/videos\/\S+$/i,
            /^https:\/\/fb\.watch\/\S+$/i,
        ],
    },
    youtube: [
        /^https:\/\/(www|m)\.youtube\.com\/watch\?v=\S{11}(|&\S+)$/i,
        /^https:\/\/youtu.be\/\S{11}(\?t=\d{1,30})?$/i,
    ],
    streamable: [/^https:\/\/streamable\.com\/[a-z|\d]{6}$/i],
};
