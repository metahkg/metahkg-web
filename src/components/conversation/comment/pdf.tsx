import React, { useCallback, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useWidth } from "../../AppContextProvider";
import { memo } from "react";
import { useTranslation } from "react-i18next";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
const PdfViewer = memo(function PdfViewer({ src }: { src: string }) {
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [width] = useWidth();

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    }, []);

    const handlePrevPage = useCallback(() => {
        setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
    }, []);

    const handleNextPage = useCallback(() => {
        setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
    }, [numPages]);

    const { t } = useTranslation();

    return (
        <Box
            className={`flex flex-col items-center ${
                width < 760 ? "w-full" : "min-w-[60%] w-min"
            }`}
        >
            <Box
                className="max-w-full shadow-lg overflow-auto"
                sx={{
                    "& .react-pdf__Page__annotations.annotationLayer": {
                        display: "none",
                    },
                }}
            >
                <Document
                    file={src}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="max-w-full overflow-auto"
                >
                    <Page
                        renderTextLayer={false}
                        pageNumber={pageNumber}
                        className="w-full object-contain"
                    />
                </Document>
            </Box>
            <Box className="flex items-center py-2">
                <IconButton onClick={handlePrevPage} disabled={pageNumber === 1}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="subtitle1" className="mx-2">
                    {t("pdf.page_count", { pageNumber, numPages })}
                </Typography>
                <IconButton onClick={handleNextPage} disabled={pageNumber === numPages}>
                    <ArrowForward />
                </IconButton>
            </Box>
        </Box>
    );
});
export default PdfViewer;
