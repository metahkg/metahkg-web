/*
 Copyright (C) 2022-present Wong Chun Yat (wcyat)

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

export type secondaryColorMain = "#651fff" | "#009688" | "#ff9800" | "#f5bd1f";
export type secondaryColorDark =
    | "rgba(101,31,255,0.5)"
    | "rgba(0,150,136,0.5)"
    | "rgba(178,106,0,0.5)"
    | "rgba(245,189,31,0.5)";
export type secondaryColor = {
    main: secondaryColorMain;
    dark: secondaryColorDark;
};

export type Theme = "light" | "dark" | "system";

export type Settings = {
    theme?: Theme;
    secondaryColor?: secondaryColor;
    filterSwearWords?: boolean;
    autoLoadImages?: boolean;
    resizeImages?: boolean;
    linkPreview?: boolean;
    pdfViewer?: boolean;
    videoPlayer?: boolean;
    notifications?: boolean;
    conversationLimit?: number;
};
