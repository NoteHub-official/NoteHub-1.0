const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const csrfMiddleware = csrf({ cookie: true });

const app = express();

app.engine("html", require("ejs").renderFile);

app.use(
  cors({
    origin: "http://localhost:8080",
  })
);

// logging in Apache combined standard
app.use(morgan("combined"));

// recognize the incoming Request Object as a JSON Object.
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(csrfMiddleware);

// The build folder for storing static files generated by Vue
app.use(express.static(path.join(__dirname, "..", "public")));

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

// simple route
app.get("/", (req, res) => {
  res.render("index.html");
});

// this is for temporary usage, need to be merged with Vue
app.get("/login", (req, res) => {
  res.render("login.html");
});

app.get("/signup", (req, res) => {
  res.render("signup.html");
});

app.get("/profile", (req, res) => {
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
      res.render("profile.html");
    })
    .catch((error) => {
      res.redirect("/login");
    });
});

app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/login");
});



app.post("/status", (req, res) => {
  console.log(req.body);
  res.json({ message: `${req.body.name} ASDASDADADASD` });
});

module.exports = app;
