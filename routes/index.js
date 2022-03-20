const router = require('express').Router()
// const { formatDate } = require('../helpers/ejs')
const {ensureAuth, ensureGuest} =require('../middleware/auth')
const Story = require('../models/Story')

// GET Login page
router.get('/', ensureGuest, (req, res)=>{
    res.render('login', {layout: "layouts/login"})
})

// GET Dashboard page
router.get('/dashboard',ensureAuth, async(req, res)=>{
    try {
        const stories = await Story.find({user: req.user.id}).lean()
        // res.locals.formatDate
        res.render('dashboard', {layout: "layouts/main",name: req.user.firstName, stories, })

    } catch (err) {
        console.error(err);
        res.render('error/500', {layout: "layouts/main"})
    }
})
router.get('/home', (req, res)=>{
    res.render('home', {layout: "layouts/main"})
})

module.exports = router