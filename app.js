const session = require('express-session');
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const db = require('./db/conn');
const User = require('./db/conn');

app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  })
);
app.get('/', (req, res) =>{
  res.render('login');
});
// login page
app.get('/login', (req, res) => {
  // Check if the user is already authenticated, and if so, redirect them to the secret page
  if (req.session.user) {
    res.redirect('/secret');
  } else {
    res.render('login');
  }
});
// Secret page route handler
app.get('/secret', (req, res) => {
  // Check if the user is authenticated before allowing access to the secret page
  if (req.session.user) {
    res.render('secret');
  } else {
    res.redirect('/login');
  }
});

// Registration
app.get('/register', (req, res) => {
  // Check if the user is already authenticated, and if so, redirect them to the secret page
  if (req.session.user) {
    res.redirect('/secret');
  } else {
    res.render('register');
  }
});

app.post('/register', async (req, res) => {
  const email = req.body['email'];
  const password = req.body['password'];
  try {
    const user = new User({ email, password });
    await user.save();
    req.session.user = user;
    res.redirect('/secret');
  } catch (error) {
    console.log('Error while registering: ' + error);
    res.redirect('/register');
  }
});


app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email, password });
      if (user) {
        req.session.user = user;
        res.redirect('/secret');
        // console.log(user)
      } else {
        res.redirect('/login');
      }
    } catch (error) {
      console.error('Error during login: ' + error);
      res.redirect('/login');
    }
  });
  

// Add a new route for logging out
app.get('/logout', (req, res) => {
  // Clear the user's session to log them out
  req.session.destroy((err) => {
    if (err) {
      console.log('Error while logging out: ' + err);
    }
    // Redirect the user to the login page after logging out
    res.redirect('/login');
  });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
