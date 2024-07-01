import { Router } from "express";
import { body } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.get("/", ProjectController.getAllProjects);
router.post("/",
    body("projectName")
        .notEmpty().withMessage("El nombre del Proyecto es Obligatorio"),
    body("clientName")
        .notEmpty().withMessage("El nombre del Cliente es Obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripción del Proyecto es Obligatorio"),
        handleInputErrors,
    ProjectController.createProject);

export default router