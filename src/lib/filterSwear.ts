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

import zhSwearWords from "naughty-words/zh.json";
import enSwearWords from "naughty-words/en.json";

export function filterSwearWords(text: string) {
    try {
        return enSwearWords
            .sort((a, b) => b.length - a.length)
            .map((i) => new RegExp(`(?<![a-z|A-Z])${i}`, "gi"))
            .reduce(
                (prev, curr) => {
                    return prev.replaceAll(curr, " *");
                },
                zhSwearWords
                    .sort((a, b) => b.length - a.length)
                    .reduce((prev, curr) => {
                        return prev.replaceAll(curr, "*");
                    }, text),
            );
    } catch (err) {
        console.error(err);
        return text;
    }
}
