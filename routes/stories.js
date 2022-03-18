const router = require("express").Router();
const moment = require("moment");
const { route } = require(".");
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/Story");
const User = require("../models/User");

// Show add page
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add", { layout: "layouts/main" });
});

// Add Stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    // req.locals.formatDate
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/500", { layout: "layouts/main" });
  }
});

// Show all stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    //   res.locals.stripTags
    //   res.locals.truncate
    console.log(stories);
    res.render("stories/index", { layout: "layouts/main", stories });
  } catch (error) {
    console.error(error);
    res.render("error/500", { layout: "layouts/main" });
  }
});

router.get("/edit/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOne({ _id: req.params.id });
  if (!story) {
    return res.render("error/404", { layout: "layouts/main" });
  }
  if (story.user != req.user.id) {
    res.redirect("/stories");
  } else {
    res.render("stories/edit", {
      layout: "layouts/main",
      story,
    });
  }
});

// Update Story
router.post("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404", { layout: "layouts/main" });
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500", { layout: "layouts/main" });
  }
});

// @desc    Delete story
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404", { layout: "layouts/main" });
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      await Story.remove({ _id: req.params.id });
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500", { layout: "layouts/main" });
  }
});

router.get('/more/:id', ensureAuth, async(req, res)=>{
    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()
    
        if (!story) {
            return res.render("error/404", { layout: "layouts/main" });
        }
        res.render('stories/show', { layout: "layouts/main" , story})
    } catch (error) {
        console.error(error);
        return res.render("error/404", { layout: "layouts/main" });
    }
})

// @desc    User stories
// @route   GET /stories/user/:userId

router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
      const stories = await Story.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
  
      res.render('stories/index', {
        stories,
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  })

module.exports = router;
