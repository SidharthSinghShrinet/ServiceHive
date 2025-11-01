const Router = require("express");
const authenticate = require("../middlewares/auth.middleware");
const { createEvent, getAllEvent, updateEvent, deleteEvent } = require("../controllers/event.controller");
const router = Router();

router.post("/create",authenticate,createEvent);
router.get("/all",authenticate,getAllEvent);
router.put("/update/:id",authenticate,updateEvent);
router.delete("/delete/:id",authenticate,deleteEvent);

module.exports = router;