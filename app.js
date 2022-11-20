const express = require("express");
const expressLayout = require("express-ejs-layouts");
const fileUpload = require("express-fileUpload");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const app = express();
const port = process.env.PORT || 3001;

require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayout);
app.use(cookieParser("CookingBlogSecure"));
app.use(
  session({
    secret: "CookingBlogSecretSession",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
app.use(fileUpload());

app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
const routes = require("./server/routes/recipeRoutes.js");
app.use("/", routes);

app.listen(port, () => console.log(`Listening to port ${port}`));
