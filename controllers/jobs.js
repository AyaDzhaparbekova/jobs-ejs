const Job = require("../models/Job");
const handleErrors = require("../util/parseValidationErr");

const getJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id });

  res.render("jobs", {
    jobs,
    title: "Jobs List"
  });
};

const addJob = async (req, res, next) => {
  try {
    await Job.create({ ...req.body, createdBy: req.user._id });
    res.redirect("/jobs");
  } catch (error) {
    handleErrors(error, req, res);
  }
};

const getNewJob = (req, res) => {
  try {
    res.render("job", {
      job: null,
      title: "Add Job"
    });
  } catch (error) {
    handleErrors(error, req, res);
  }
};
const editJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!job) {
      req.flash("error", "Job not found or access denied");
      return res.status(404).redirect("/jobs");
    }

    res.render("job", { job,
      title: "Edit Job"
     });
  } catch (error) {
    handleErrors(error, req, res, "/jobs");
  }
};

const updateJob = async (req, res, next) => {
  try {
    const updatedJobs = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedJobs) {
      req.flash("error", "Job not found");
      return res.status(404).redirect("/jobs");
    }
    res.redirect("/jobs");
  } catch (error) {
    handleErrors(error, req, res, "/jobs/edit/" + req.params.id);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const deletedJob = await Job.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!deletedJob) {
      req.flash("error", "Job not found");
      return res.status(404).redirect("/jobs");
    }
    req.flash("success", "Job was deleted");
    res.redirect("/jobs");
  } catch (error) {
    handleErrors(error, req, res, "/jobs");
  }
};

module.exports = {
  getNewJob,
  getJobs,
  addJob,
  editJob,
  updateJob,
  deleteJob,
};