const express = require('express');
const multer = require('multer');
const {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
} = require('../controllers/foodController'); // <-- THIS must match exactly

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getFoods);
router.post('/', upload.single('image'), createFood);
router.put('/:id', upload.single('image'), updateFood);
router.delete('/:id', deleteFood);

module.exports = router;
