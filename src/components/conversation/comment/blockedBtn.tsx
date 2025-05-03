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

import { Button, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

import { memo } from "react";
const BlockedBtn = memo(function BlockedBtn(props: {
    userName: string;
    reason?: string;
    setBlocked?: (x?: boolean) => void;
    className?: string;
}) {
    const { userName, reason, setBlocked, className } = props;
    const { t } = useTranslation();

    return (
        <Tooltip
            arrow
            title={
                reason
                    ? t("blockedBtn.tooltip_blocked_user_with_reason", {
                          userName,
                          reason,
                      })
                    : t("blockedBtn.tooltip_blocked_user", { userName })
            }
        >
            <Button
                className={`${className} !text-sm !normal-case`}
                color="error"
                onClick={() => {
                    setBlocked?.(false);
                }}
                variant="outlined"
            >
                {t("blockedBtn.view_comment")}
            </Button>
        </Tooltip>
    );
});
export default BlockedBtn;
