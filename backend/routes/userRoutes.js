const express = require('express');

const {
    updateProfile,
    deleteResume,
    getPublicProfile
} = require('../controllers/userController');


const { protect } = require('../middlewares/authmiddleware');

const router = express.Router();

// Protected Routes
const upload = require("../middlewares/uploadMiddleware");

router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
  ]),
  updateProfile
);

router.post('/resume', protect, deleteResume)


// public routes 
router.get('/:id',getPublicProfile)


module.exports = router;
