require("dotenv").config();
const express = require("express");
const app = express();
app.disable("x-powered-by");
app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://js.hcaptcha.com https://sa.wcyat.engineer https://analytics.wcyat.me https://static.cloudflareinsights.com https://cdnjs.cloudflare.com"
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