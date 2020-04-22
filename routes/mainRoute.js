var express = require('express')
router = express.Router();
User = require('../models/UserModel')
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
      res.render("Profile", { username: req.user.username, tweets: req.user.tweets})
  } else {
    res.redirect('/login')
  }
})
router.get('/all', (req, res, next) => {
  if(req.isAuthenticated()){
    User.find({}, (err, result) => {
      if (err) throw err;
      var tweets = []

      for(e in result){
        for(x in result[e].tweets){
        tweets.push({tweet:result[e].tweets[x].tweet , username:result[e].username ,date:  result[e].tweets[x].date,likedBy:result[e].tweets[x].likedBy})
        }
      }
     res.render("AllTweets",{tweets:tweets})
    })
  }
  else{
    res.redirect('/login')
  }
})
router.post("/post", (req, res) => {
  var dt = Date()
  dt = dt.split("GMT-0400 (Eastern Daylight Time)")

  dt.pop()
  dt.toString()

  User.findOne({ username: req.user.username }, (err, result) => {
    if (err) console.log(err)
    result.tweets.push({ tweet: req.body.tweetBox, date: dt ,likedBy:Array})
    result.save()
    res.redirect("back")
  })
})


router.post('/like',(req,res) =>{
  if(req.isAuthenticated()){
    var us = req.body.twtVal;
    us = us.split(",")
    User.findOne({username:us[1]},(err,r) =>{
      if(err) {throw err;}
     for(i in r.tweets){
        if(r.tweets[i].tweet == req.body.twtVal[0]){
          if(r.tweets[i].likedBy.includes(req.user.username)){
            r.tweets[i].likedBy.splice(i,1)
          }else{ 
            r.tweets[i].likedBy.push(req.user.username)
          }
        }
      }
      console.log(req.user.username) 
      console.log(r.tweets[0].likedBy) 
      r.markModified('tweets');
      r.save()
      res.redirect('back')
    })
  }
  else{
    res.redirect('/login')
  }
})



router.get('/signout',(req,res) =>{
  req.logout()
  res.redirect('/')
})

module.exports = router;