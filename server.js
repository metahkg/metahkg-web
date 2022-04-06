require("dotenv").config();
const express = require("express");
const app = express();
app.disable("x-powered-by");
app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://connect.facebook.net https://platform.twitter.com/widgets.js https://platform.twitter.com/js/ https://www.youtube.com https://www.gstatic.com/recaptcha/ https://www.google.com/recaptcha/ https://sa.metahkg.org https://static.cloudflareinsights.com https://cdnjs.cloudflare.com"
  );
  return next();
});
app.use(express.static("build"));
app.get("(/*)?", async (req, res) => {
  res.sendFile("index.html", { root: "build" });
});
app.listen(Number(process.env.port) || 3199, () => {
  console.log(`listening at port ${process.env.port || 3199}`);
});
