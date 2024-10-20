import { Router } from "express";
import { resumeBuilder } from "../controllers/pdf/userResume.js";

const resumeRoute=Router()

resumeRoute.route('/resume').post(resumeBuilder)
export default resumeRoute