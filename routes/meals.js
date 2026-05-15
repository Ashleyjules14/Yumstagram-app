const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

router.get('/', async (req, res) => {
  try {
    const meals = await Meal.find().sort({ createdAt: -1 }).limit(20);
    const apiRes = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const apiData = await apiRes.json();
    const featured = apiData.meals ? apiData.meals[0] : null;
    res.render('index', { meals, featured });
  } catch (err) {
    console.error(err);
    res.render('index', { meals: [], featured: null });
  }
});

router.get('/post', (req, res) => {
  res.render('post', { error: null });
});

router.post('/post', (req, res) => {
  const upload = req.app.locals.upload;
  upload.single('image')(req, res, async (err) => {
    if (err) return res.render('post', { error: 'Image upload failed. Please use JPG, PNG, GIF, or WEBP.' });
    if (!req.file) return res.render('post', { error: 'Please upload an image.' });
    try {
      console.log('FILE:', JSON.stringify(req.file));
      const { username, title, description, category } = req.body;
      const meal = new Meal({
        username,
        title,
        description,
        image: req.file.path,
        category
      });
      await meal.save();
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.render('post', { error: 'Something went wrong. Please try again.' });
    }
  });
});

router.post('/like/:id', async (req, res) => {
  try {
    await Meal.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;