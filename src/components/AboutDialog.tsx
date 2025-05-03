import { Box, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "../lib/link";
import { PopUp } from "../lib/popup";
import { useServerConfig } from "./AppContextProvider";

export function AboutDialog(props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { t } = useTranslation();
    const { open, setOpen } = props;
    const [serverConfig] = useServerConfig();

    return (
        <PopUp title={t("about.title")} closeBtn open={open} setOpen={setOpen} fullWidth>
            <Box className="mb-4 flex flex-col">
                <Typography variant="body1" gutterBottom className="!mt-4">
                    {serverConfig?.branding && serverConfig?.branding !== "Metahkg"
                        ? t("about.powered_by", { branding: serverConfig.branding })
                        : ""}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {t("about.description")}
                </Typography>
                <Typography variant="h5" gutterBottom>
                    {t("about.source_code_heading")}
                </Typography>
                <Typography gutterBottom>
                    <Link
                        href="https://gitlab.com/metahkg/metahkg"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t("about.main_repo_link")}
                    </Link>
                </Typography>
                <Typography gutterBottom>
                    <Link
                        href="https://gitlab.com/metahkg/metahkg-web"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t("about.web_app_link")}
                    </Link>
                </Typography>
                {import.meta.env.VITE_APP_version ? (
                    <React.Fragment>
                        <Typography gutterBottom variant="h5">
                            {t("about.version_heading")}
                        </Typography>
                        <Typography gutterBottom>
                            <Link
                                href={`https://gitlab.com/metahkg/metahkg-web/-/tree/${
                                    import.meta.env.VITE_APP_version
                                }`}
                                className="inline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                v{import.meta.env.VITE_APP_version}
                            </Link>
                        </Typography>
                        <Typography gutterBottom>
                            <Link
                                href={`https://gitlab.com/metahkg/metahkg-web/-/blob/${
                                    import.meta.env.VITE_APP_version
                                }/CHANGELOG.md`}
                                className="inline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t("about.changelog_link")}
                            </Link>
                        </Typography>
                    </React.Fragment>
                ) : null}
                {import.meta.env.VITE_APP_build ? (
                    <React.Fragment>
                        <Typography variant="h5" gutterBottom>
                            {t("about.build_heading")}
                        </Typography>
                        <Typography gutterBottom>
                            <Link
                                href={`https://gitlab.com/metahkg/metahkg-web/-/commit/${
                                    import.meta.env.VITE_APP_build
                                }`}
                                className="inline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {import.meta.env.VITE_APP_build}
                            </Link>
                        </Typography>
                    </React.Fragment>
                ) : null}
                {!import.meta.env.VITE_APP_build && import.meta.env.VITE_APP_date ? (
                    <React.Fragment>
                        <Typography variant="h5" gutterBottom>
                            {t("about.build_heading")}
                        </Typography>
                        <Typography gutterBottom>
                            {import.meta.env.VITE_APP_date}
                        </Typography>
                    </React.Fragment>
                ) : null}
                <Typography variant="h5" gutterBottom>
                    {t("about.copyright_heading")}
                </Typography>
                <Typography gutterBottom>{t("about.copyright_text")}</Typography>
                <Typography gutterBottom>
                    <Link
                        href="https://gitlab.com/metahkg/metahkg/-/tree/master/LICENSE.md"
                        className="inline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t("about.license_link")}
                    </Link>
                </Typography>
                <Typography gutterBottom>
                    <Link
                        href="/third-party-licenses.txt"
                        className="inline"
                        target="_blank"
                    >
                        {t("about.third_party_licenses_link")}
                    </Link>
                </Typography>
                <Typography variant="h6" gutterBottom>
                    {t("about.logo_heading")}
                </Typography>
                <Typography gutterBottom>{t("about.logo_copyright")}</Typography>
                <Typography gutterBottom>
                    {t("about.see_text")}{" "}
                    <Link
                        href="https://gitlab.com/metahkg/metahkg-web/-/tree/master/public/images/LICENSE"
                        className="inline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        metahkg-web@public/images/LICENSE
                    </Link>{" "}
                    {t("about.for_more_info_text")}
                </Typography>
            </Box>
        </PopUp>
    );
}
