/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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

export const regexString = {
    // see: https://gitlab.com/metahkg/metahkg-server/-/blob/f628abbcfbb2f30ab0e94ad2762e006073eab3d6/src/lib/schemas.ts#L35
    username: `[a-zA-Z0-9\\u0370-\\u03ff\\u1f00-\\u1fff\\u3000-\\u303F\\u3400-\\u4DBF\\u4E00-\\u9FFF一-龯\\p{Emoji}\\p{Emoji_Presentation}\\p{Extended_Pictographic}~!#$%^&*_\\-=+\\(\\)\\[\\]\\{\\}\\|\\\\\\.,\\/\\?"';:<>]{1,15}`,
    email: "[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9}",
    password: "\\S{8,}",
};
