const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const nocache = require("nocache");

const app = express();

// Middleware setup
app.use(
  session({
    secret: "yourSecretKey",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

// Set the views directory and view engine for EJS
app.set("views", __dirname + "/partials");
app.set("view engine", "ejs");

// Middleware to prevent caching of the login page
app.use((req, res, next) => {
  if (req.path === "/") {
    res.setHeader(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate"
    );
    res.setHeader("Expires", "-1");
    res.setHeader("Pragma", "no-cache");
  }
  next();
});

// Middleware to check if the user is already logged in
const redirectLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    res.redirect("/home"); // Redirect to the home page if the user is already logged in
  } else {
    next();
  }
};

// Middleware to check if the session is still active
const checkSession = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/"); // Redirect to the login page if the session is not active
  } else {
    next();
  }
};

// Routes
app.get("/", redirectLoggedIn, (req, res) => {
  res.render("login"); // Render the login.ejs file
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "user" && password === "password") {
    req.session.isLoggedIn = true;
    res.redirect("/home");
  } else {
    res.send('Incorrect username or password. <a href="/">Go back</a>');
  }
});

app.get("/home", checkSession, (req, res) => {
  res.render("home"); // Render the home.ejs file
});

app.get("/signout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});