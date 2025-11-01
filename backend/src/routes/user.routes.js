const Router = require('express');
const { registerUser,loginUser,logoutUser, getProfile } = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const router = Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/logout',logoutUser);
router.get('/me',authenticate,getProfile);

module.exports = router;