const passport = require("passport");

const router = require("express").Router();

// GET auth with/google 
router.get('/google',
  passport.authenticate('google', { scope: ["profile"]})
);

// GET auth/google/callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect(`/dashboard`);
});

router.get('/logout', (req,res)=>{
  req.logOut()
  res.redirect('/')
})




module.exports = router;
