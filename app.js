const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "credentialsDontPost/.env"),
});

const app = express();

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ─── Cloudinary (image uploads) ──────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
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