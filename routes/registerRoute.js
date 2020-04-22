var express = require('express')
router = express.Router()
User = require('../models/UserModel')

//Login
router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/')
  }
  else {
    res.render("LogIn",{message:undefined})
  }
})
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (info) { return res.render("LogIn",{message: info.message}) }
    if (err) { return next(err); }
    if (!user) { return res.redirect('/'); }
    req.login(user, (err) => {
      if (err) { return next(err); }
      req.user = user
      return res.redirect('/');
    })
  })(req, res, next);
})
//Register
router.get('/register', (req, res, next) => {
  res.render('Register',{sucess:undefined,err:undefined})
})
router.post('/register', (req, res, next) => {
  var errs = []
  let {username, email,password,confirmPassword } = req.body;
  var newUser = new User({
    username: username,
    email: email,
    password: password
  })

  newUser.save((saveErr) => {
    if (saveErr) {
        if(saveErr.errmsg.toString().includes("email"))  errs.push("Email Already registered")
        if(saveErr.errmsg.toString().includes("username")) errs.push("Username taken")
      else if(req.body.password != req.body.confirmPassword) errs.push("Password do not match")
      res.render('Register',{err:errs,sucess:undefined})
    }
    else{res.render("Register",{sucess:"Account created",err:undefined})}
  })
})

module.exports = router;