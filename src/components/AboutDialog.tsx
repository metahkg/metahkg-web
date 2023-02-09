import { Box, Link, Typography } from "@mui/material";
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
                <Typography variant="body1" gutterBottom className="!mt-[15px]">
                    Metahkg is a free and open source lihkg-style forum.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Source code
                </Typography>
                <Typography gutterBottom>
                    <Link
                        href="https://gitlab.com/metahkg/metahkg"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Metahkg Main Repository
                    </Link>
                </Typography>
                <Typography gutterBottom>
                    <Link
                        href="https://gitlab.com/metahkg/metahkg-web"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Metahkg Web App
                    </Link>
                </Typography>
                {process.env.REACT_APP_version ? (
                    <React.Fragment>
                        <Typography gutterBottom variant="h5">
                            Version
                        </Typography>
                        <Typography gutterBottom>
                            <Link
                                href={`https://gitlab.com/metahkg/metahkg-web/-/tree/${process.env.REACT_APP_version}`}
                                className="inline"
                                target="_blank"
                                rel="noreferrer"
                            >
                                v{process.env.REACT_APP_version}
                            </Link>
                        </Typography>
                        <Typography gutterBottom>
                            <Link
                                href={`https://gitlab.com/metahkg/metahkg-web/-/blob/${process.env.REACT_APP_version}/CHANGELOG.md`}
                                className="inline"
                                target="_blank"
                                rel="noreferrer"
                            >
                                CHANGELOG
                            </Link>
                        </Typography>
                    </React.Fragment>
                ) : null}
                {process.env.REACT_APP_build ? (
                    <React.Fragment>
                        <Typography variant="h5" gutterBottom>
                            Build
                        </Typography>
                        <Typography gutterBottom>
                            <Link
                                href={`https://gitlab.com/metahkg/metahkg-web/-/commit/${process.env.REACT_APP_build}`}
                                className="inline"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {process.env.REACT_APP_build}
                            </Link>
                        </Typography>
                    </React.Fragment>
                ) : null}
                {!process.env.REACT_APP_build && process.env.REACT_APP_date ? (
                    <React.Fragment>
                        <Typography variant="h5" gutterBottom>
                            Build
                        </Typography>
                        <Typography gutterBottom>{process.env.REACT_APP_date}</Typography>
                    </React.Fragment>
                ) : null}
                <Typography variant="h5" gutterBottom>
                    Copyright
                </Typography>
                <Typography gutterBottom>
                    Metahkg Copyright (c) 2022-present Metahkg Contributors
                </Typography>
                <Typography gutterBottom>
                    <Link
                        href="https://gitlab.com/metahkg/metahkg/-/tree/master/LICENSE.md"
                        className="inline"
                        target="_blank"
                        rel="noreferrer"
                    >
                        AGPL-3.0-or-later
                    </Link>
                </Typography>
                <Typography gutterBottom>
                    <Link
                        href="/third-party-licenses.txt"
                        className="inline"
                        target="_blank"
                    >
                        Third-party Licenses
                    </Link>
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Logo
                </Typography>
                <Typography gutterBottom>
                    Metahkg logo Copyright (c) 2022 "white card", CC-BY-4.0
                </Typography>
                <Typography gutterBottom>
                    See{" "}
                    <Link
                        href="https://gitlab.com/metahkg/metahkg-web/-/tree/master/public/images/LICENSE"
                        className="inline"
                        target="_blank"
                        rel="noreferrer"
                    >
                        metahkg-web@public/images/LICENSE
                    </Link>{" "}
                    for more information.
                </Typography>
            </Box>
        </PopUp>
    );
}
