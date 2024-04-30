const { Router } = require("express");
const { createRepository } = require("../controllers/GitServiceController");
const router = Router();

// Get all GitRoutess
router.post("/createRepository", createRepository);

module.exports = router;
