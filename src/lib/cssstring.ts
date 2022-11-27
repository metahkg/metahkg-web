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

export function CSSstring(string: string): React.CSSProperties {
    try {
        const css_json = `{"${string
            .replace(/; /g, '", "')
            .replace(/: /g, '": "')
            .replace(";", "")}"}`;

        const obj = JSON.parse(css_json);

        const keyValues = Object.keys(obj).map((key) => {
            var camelCased = key.replace(/-[a-z]/g, (g) => g[1].toUpperCase());
            return { [camelCased]: obj[key] };
        });
        return Object.assign({}, ...keyValues);
    } catch {
        return {};
    }
}
