const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const nocache = require("nocache");

const app = express();

// Middleware setup
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.set("views", __dirname + "/partials");
app.set("view engine", "ejs");

app.use(nocache());

// Middleware to check if the user is already logged in
const redirectLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    res.redirect("/home");
  } else {
    next();
  }
};

// Middleware to check if the session is still active
const checkSession = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  } else {
    next();
  }
};

// Routes
app.get("/", redirectLoggedIn, (req, res) => {
  res.render("login");
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
  res.render("home");
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
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
