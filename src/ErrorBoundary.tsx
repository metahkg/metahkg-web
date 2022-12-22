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

/*
MIT License

Copyright (c) 2016-2022 Laurent Cozic

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import React from "react";

interface State {
    error: Error | null;
}

interface Props {
    message?: string;
    children?: JSX.Element | JSX.Element[];
}

export default class ErrorBoundary extends React.Component<Props, State> {
    public state: State = { error: null };

    componentDidCatch(error: any) {
        if (typeof error === "string") error = { message: error };

        this.setState({ error });
    }

    renderMessage() {
        const message =
            this.props.message ||
            "Metahkg web encountered a fatal error and could not continue.";
        return <p>{message}</p>;
    }

    render() {
        if (this.state.error) {
            try {
                const output = [];

                output.push(
                    <section key="message">
                        <h2>Message</h2>
                        <p>{this.state.error.message}</p>
                    </section>
                );

                output.push(
                    <section key="versionInfo">
                        <h2>Version info</h2>
                        <pre>
                            {process.env.REACT_APP_build || process.env.REACT_APP_date} (v
                            {process.env.REACT_APP_version})
                        </pre>
                    </section>
                );

                if (this.state.error.stack) {
                    output.push(
                        <section key="stacktrace">
                            <h2>Stack trace</h2>
                            <pre>{this.state.error.stack}</pre>
                        </section>
                    );
                }

                return (
                    <div className="overflow-scroll py-[5px] px-[20px]">
                        <h1>Error</h1>
                        {this.renderMessage()}
                        <p>
                            To report the error, please copy the *entire content* of this
                            page and post it on{" "}
                            <a href="https://t.me/+WbB7PyRovUY1ZDFl">telegram</a> or{" "}
                            <a href="https://gitlab.com/metahkg/metahkg-web/-/issues">
                                gitlab
                            </a>
                            .
                        </p>
                        {output}
                    </div>
                );
            } catch (error) {
                return (
                    <div style={{ height: "100vh" }}>{JSON.stringify(this.state)}</div>
                );
            }
        }

        return this.props.children;
    }
}
