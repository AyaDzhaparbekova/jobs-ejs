const express = require("express");
const router = express.Router();

const {
  getJobs,
  addJob,
  getNewJob,
  editJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

router.get("/", getJobs);
router.post("/", addJob);

router.get("/new", getNewJob);
router.get("/edit/:id", editJob);
router.post("/update/:id", updateJob);
router.post("/delete/:id", deleteJob);

module.exports = router;