// categoryRoute.js — factory that creates a router for a given meal category
const express = require('express');
const Meal = require('../models/Meal');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

// MealDB category mapping
const mealDBCategory = {
  breakfast: 'Breakfast',
  lunch:     'Chicken',   // closest general lunch category in MealDB
  dinner:    'Beef',
  dessert:   'Dessert'
};

module.exports = function createCategoryRouter(category) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const meals = await Meal.find({ category }).sort({ createdAt: -1 });

      // MealDB API: fetch recipe inspiration for this category
      const mdbCat = mealDBCategory[category];
      const apiRes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${mdbCat}`);
      const apiData = await apiRes.json();
      // pick 3 random suggestions
      const all = apiData.meals || [];
      const suggestions = all.sort(() => 0.5 - Math.random()).slice(0, 3);

      res.render('category', { meals, category, suggestions });
    } catch (err) {
      console.error(err);
      res.render('category', { meals: [], category, suggestions: [] });
    }
  });

  return router;
};
