const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const crypto = require('crypto');

const app = express();

// Middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    }
}));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', './partials');
app.set('view engine', 'ejs');

// Middleware to check if user is logged in
const requireLogin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.redirect('/');
    } else {
        next();
    }
};

// Routes
app.get('/', (req, res) => {
    if (req.session.isLoggedIn) {
        res.redirect('/home');
    } else {
        res.render('login');
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check username and password against predefined values
    if (username === 'admin' && password === 'password') {
        req.session.isLoggedIn = true;
        req.session.username = username;
        res.redirect('/home');
    } else {
        res.send('Incorrect username or password. <a href="/">Go back</a>');
    }
});

app.get('/home', requireLogin, (req, res) => {
    res.render('home', { username: req.session.username });
});

app.get('/profile', requireLogin, (req, res) => {
    res.render('profile', { username: req.session.username });
});

app.get('/logout', requireLogin, (req, res) => {
    // Set flag to indicate logout initiated by the user
    req.session.logoutInitiated = true;
    res.render('logout');
});

app.post('/logout', requireLogin, (req, res) => {
    // Check if logout initiated by the user
    if (req.session.logoutInitiated) {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error logging out.');
            } else {
                res.redirect('/');
            }
        });
    } else {
        // If logout not initiated by the user, redirect to home page
        res.redirect('/home');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
