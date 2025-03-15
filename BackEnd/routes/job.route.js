import express from 'express';
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {getAllJobs, getJobById, getJobByMe, postJob} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/get/:id").post(isAuthenticated, getJobById);
router.route("/get/jobsbyme").get(isAuthenticated, getJobByMe);

export default router;