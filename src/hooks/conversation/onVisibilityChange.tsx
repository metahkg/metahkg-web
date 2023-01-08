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

import { useNavigate } from "react-router-dom";
import {
    useCRoot,
    useCurrentPage,
    useLastHeight,
    useThread,
} from "../../components/conversation/ConversationContext";
import queryString from "query-string";

export default function useOnVisibilityChange() {
    const croot = useCRoot();
    const lastHeight = useLastHeight();
    const [, setCurrentPage] = useCurrentPage();
    const [thread] = useThread();
    const navigate = useNavigate();
    const query = queryString.parse(window.location.search);

    return (isVisible: boolean, page: number) => {
        let Page = page;
        if (isVisible) {
            lastHeight.current = croot.current?.scrollTop || lastHeight.current;
            if (Page !== Number(query.page) && Page) {
                navigate(`${window.location.pathname}?page=${Page}`, {
                    replace: true,
                });
                setCurrentPage(Page);
            }
        }
        if (!isVisible && thread && thread.conversation.length) {
            if (lastHeight.current !== croot.current?.scrollTop && croot.current) {
                Page = croot.current.scrollTop > lastHeight.current ? Page : Page - 1;
                if (lastHeight.current && Page !== Number(query.page) && Page) {
                    navigate(`${window.location.pathname}?page=${Page}`, {
                        replace: true,
                    });
                    setCurrentPage(Page);
                }
            }
        }
    };
}
