const authenticate = require("../middlewares/auth.middleware");
const Router = require('express');
const { allSwappableSlots, createSwapRequest, respondToSwapRequest, getSwapRequest } = require('../controllers/swapRequest.controller');
const router = Router();

router.get("/all",authenticate,allSwappableSlots);
router.post("/create",authenticate,createSwapRequest);
router.post("/respond/:id",authenticate,respondToSwapRequest);
router.get("/get",authenticate,getSwapRequest);

module.exports = router;