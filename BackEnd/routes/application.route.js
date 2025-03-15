import express from 'express';
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedjobs, updateStatus } from "../controllers/application.controller.js";

const router = express.Router();

router.route("/apply/:id").post(isAuthenticated, applyJob);
router.route("/applied-jobs").get(isAuthenticated, getAppliedjobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id").patch(isAuthenticated, updateStatus);

export default router;
