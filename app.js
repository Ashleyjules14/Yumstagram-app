const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── Cloudinary (image uploads) ──────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'yumstagram', allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }
});

const upload = multer({ storage });
app.locals.upload = upload;

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/',          require('./routes/meals'));
app.use('/breakfast', require('./routes/breakfast'));
app.use('/lunch',     require('./routes/lunch'));
app.use('/dinner',    require('./routes/dinner'));
app.use('/dessert',   require('./routes/dessert'));

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🍽️  Yumstagram running on http://localhost:${PORT}`));