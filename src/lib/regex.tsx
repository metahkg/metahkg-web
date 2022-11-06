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
        /^https:\/\/youtu.be\/\S{11}$/i,
    ],
    streamable: [/^https:\/\/streamable\.com\/[a-z|\d]{6}$/],
};
