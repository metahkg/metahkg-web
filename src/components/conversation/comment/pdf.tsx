import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useWidth } from "../../AppContextProvider";

export default function PdfViewer({ src }: { src: string }) {
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [width] = useWidth();

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handlePrevPage = () => {
        setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
    };

    const handleNextPage = () => {
        setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
    };

    return (
        <Box
            className={`flex flex-col items-center ${
                width < 760 ? "w-full" : "min-w-[60%] w-min"
            }`}
        >
            <Box
                className="shadow-lg"
                sx={{
                    "& .react-pdf__Page__annotations.annotationLayer": {
                        display: "none",
                    },
                }}
            >
                <Document
                    file={src}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="overflow-hidden"
                >
                    <Page
                        height={800}
                        renderTextLayer={false}
                        pageNumber={pageNumber}
                        className="max-w-full h-[800px]"
                    />
                </Document>
            </Box>
            <Box className="flex items-center py-2">
                <IconButton onClick={handlePrevPage} disabled={pageNumber === 1}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="subtitle1" className="mx-2">
                    Page {pageNumber} of {numPages}
                </Typography>
                <IconButton onClick={handleNextPage} disabled={pageNumber === numPages}>
                    <ArrowForward />
                </IconButton>
            </Box>
        </Box>
    );
}
