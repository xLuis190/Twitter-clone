const  { v4: uuidv4 } = require('uuid')
express = require('express'),
app = express(),
bodyParser = require('body-parser'),
passport = require('passport'),
mongoose = require('mongoose'),
session = require('express-session'),
LocalStrategy = require('passport-local').Strategy
mainRoute = require('./routes/mainRoute')
User = require('./models/UserModel')
registerRoute = require('./routes/registerRoute')
port = 80
//Mongoose
mongoose.set('useCreateIndex', true);
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then().
  catch((err) => {
    if (err) throw err
  })  
  //Passport setup
passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'User doesnt exist' })
      }
      if (!(user.password == password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.set('view engine', 'ejs');

app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(session({
  genid: (req) => {
    return uuidv4() // use UUID's for session id
  },
  secret: 'This is a very dark secret',
  resave: true,
  saveUninitialized: true
}))
//Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/', registerRoute);
app.use("/", mainRoute)

app.listen(port, (err) => {
  if (err) console.log(err)
  console.log(`Server running on port ${port}`)
})
