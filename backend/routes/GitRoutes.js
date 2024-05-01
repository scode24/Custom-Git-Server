const { Router } = require("express");
const {
  createRepository,
  getRepositoryContent,
  getRepositoryList,
} = require("../controllers/GitServiceController");
const router = Router();

// Get all GitRoutess
router.post("/createRepository", createRepository);
router.get("/getRepositoryList", getRepositoryList);
router.get("/getRepositoryContent/:repositoryName", getRepositoryContent);

module.exports = router;
