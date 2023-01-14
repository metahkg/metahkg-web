import { Box } from "@mui/material";
import React from "react";
import { PopUp } from "../lib/popup";

export function AboutDialog(props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { open, setOpen } = props;
    return (
        <PopUp title="About Metahkg" closeBtn open={open} setOpen={setOpen} fullWidth>
            <Box className="mb-[15px] flex flex-col">
                <p className="mb-0">
                    Metahkg is a free and open source lihkg-style forum.
                </p>
                <h3>Source code</h3>
                <a
                    href="https://gitlab.com/metahkg/metahkg"
                    target="_blank"
                    rel="noreferrer"
                >
                    Metahkg Main Repository
                </a>
                <a
                    href="https://gitlab.com/metahkg/metahkg-web"
                    className="mt-[10px]"
                    target="_blank"
                    rel="noreferrer"
                >
                    Metahkg Web App
                </a>
                {process.env.REACT_APP_version ? (
                    <React.Fragment>
                        <h3>Version</h3>
                        <a
                            href={`https://gitlab.com/metahkg/metahkg-web/-/tree/${process.env.REACT_APP_version}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            v{process.env.REACT_APP_version}
                        </a>
                        <a
                            href={`https://gitlab.com/metahkg/metahkg-web/-/blob/${process.env.REACT_APP_version}/CHANGELOG.md`}
                            className="mt-[10px]"
                            target="_blank"
                            rel="noreferrer"
                        >
                            CHANGELOG
                        </a>
                    </React.Fragment>
                ) : (
                    <></>
                )}
                {process.env.REACT_APP_build ? (
                    <React.Fragment>
                        <h3>Build</h3>
                        <a
                            href={`https://gitlab.com/metahkg/metahkg-web/-/commit/${process.env.REACT_APP_build}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {process.env.REACT_APP_build}
                        </a>
                    </React.Fragment>
                ) : (
                    <></>
                )}
                {!process.env.REACT_APP_build && process.env.REACT_APP_date ? (
                    <React.Fragment>
                        <h3>Build</h3>
                        <p className="my-0">{process.env.REACT_APP_date}</p>
                    </React.Fragment>
                ) : (
                    <></>
                )}
                <h3>Copyright</h3>
                <p className="my-0">
                    Metahkg Copyright (c) 2022-present Metahkg Contributors
                </p>
                <p className="mb-0">
                    <a href="https://gitlab.com/metahkg/metahkg/-/tree/master/LICENSE.md">
                        AGPL-3.0-or-later
                    </a>
                </p>
            </Box>
        </PopUp>
    );
}
