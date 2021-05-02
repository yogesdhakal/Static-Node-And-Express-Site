/* THE REQUIRED VARIABLES */
const express = require('express');
const app = express();
const data = require('./data.json');
const path = require('path');

/* SETTING UP THE MIDDLEWARE*/

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/static', express.static('public'));

/* SETTING UP THE ROUTES */

// Home Page
app.get('/', (req, res) => {
  res.render('index', { projects: data.projects });
})

// About Page
app.get('/about', (req, res) => {
  res.render('about');
})

// Project Page
app.get('/projects/:id', (req, res) => {
  const project = data.projects[req.params.id - 1];

  res.render('project', { project });
})

/* HANDILING ERRORS */

// Page not found(404) handler
app.use((req, res, next) => {
  const err = new Error('The page you requested cannot be found');
  err.status = 404;
  console.log(`${err.status}. ${err.message}`);
  next(err);
})

/* HANDILING GLOBAL ERRORS */

app.use((error, req, res, next) => {
  // Check the Error Object Has Status & Message Properties Defined
  error.status = error.status || 500;
  error.message = error.message || 'Server error';

  // Set Response Status
  res.status(error.status);

  // Render Template Based On Status Code
  if (res.statusCode === 404) {
    res.render('page-not-found', { error });
  }
  else {
    console.log(`Sorry. There has been an error`);
    
    res.render('error', { error: {
      status: error.status,
      message: 'Server error'
    } });
  }
})

/* STARTING THE SERVER */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));