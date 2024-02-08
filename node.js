
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.use(
  session({
    secret: 'yourSecretKey',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'user' && password === 'password') {
    req.session.isLoggedIn = true;
    res.redirect('/home');
  } else {
    res.send('Incorrect username or password. <a href="/">Go back</a>');
  }
});

app.get('/home', (req, res) => {
  if (req.session.isLoggedIn) {
    res.sendFile(__dirname + '/home.html');
  } else {
    res.redirect('/');
  }
});

app.get('/profile', (req,res)=> {
  
    res.sendFile(__dirname + '/profile.html');

});

app.get('/signout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

app.get('/profile', (req,res)=> {
  if(req.session.isLoggedIn) {
    res.sendFile(__dirname + '/profile.html');
  }else {
    res.redirect('/home')
  }
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

