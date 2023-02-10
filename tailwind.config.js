/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                link: "#3498db",
                "metahkg-grey": "#aca9a9",
                "metahkg-yellow": "#f5bd1f",
            },
            height: {
                "10v": "10vh",
                "20v": "20vh",
                "30v": "30vh",
                "40v": "40vh",
                "50v": "50vh",
                "60v": "60vh",
                "70v": "70vh",
                "80v": "80vh",
                "90v": "90vh",
                "100v": "100vh",
            },
            width: {
                "10v": "10vw",
                "20v": "20vw",
                "30v": "30vw",
                "40v": "40vw",
                "50v": "50vw",
                "60v": "60vw",
                "70v": "70vw",
                "80v": "80vw",
                "90v": "90vw",
                "100v": "100vw",
            },
            minHeight: {
                "10v": "10vh",
                "20v": "20vh",
                "30v": "30vh",
                "40v": "40vh",
                "50v": "50vh",
                "60v": "60vh",
                "70v": "70vh",
                "80v": "80vh",
                "90v": "90vh",
                "100v": "100vh",
            },
            maxHeight: {
                "10v": "10vh",
                "20v": "20vh",
                "30v": "30vh",
                "40v": "40vh",
                "50v": "50vh",
                "60v": "60vh",
                "70v": "70vh",
                "80v": "80vh",
                "90v": "90vh",
                "100v": "100vh",
            },
            minWidth: {
                "10v": "10vw",
                "20v": "20vw",
                "30v": "30vw",
                "40v": "40vw",
                "50v": "50vw",
                "60v": "60vw",
                "70v": "70vw",
                "80v": "80vw",
                "90v": "90vw",
                "100v": "100vw",
            },
            maxWidth: {
                "10v": "10vw",
                "20v": "20vw",
                "30v": "30vw",
                "40v": "40vw",
                "50v": "50vw",
                "60v": "60vw",
                "70v": "70vw",
                "80v": "80vw",
                "90v": "90vw",
                "100v": "100vw",
            },
            fontSize: {
                "inherit-size": "inherit",
            },
        },
    },
    plugins: [
        function ({ addVariant }) {
            addVariant("child", "& *");
            addVariant("child-a", "& a");
            addVariant("child-img", "& img");
            addVariant("child-video", "& video");
            addVariant("child-blockquote", "& blockquote");
        },
    ],
};
