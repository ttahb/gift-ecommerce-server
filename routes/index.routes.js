const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/", isAuthenticated, (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;