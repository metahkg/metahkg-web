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

import { Button, Tooltip } from "@mui/material";

export default function BlockedBtn(props: {
    userName: string;
    reason?: string;
    setBlocked?: (x?: boolean) => void;
    className?: string;
}) {
    const { userName, reason, setBlocked, className } = props;

    return (
        <Tooltip
            arrow
            title={`User ${userName} blocked${reason ? ` because of "${reason}"` : ""}.`}
        >
            <Button
                className={`${className} !text-[14px] !normal-case`}
                color="error"
                onClick={() => {
                    setBlocked?.(false);
                }}
                variant="outlined"
            >
                Click to view comment
            </Button>
        </Tooltip>
    );
}
