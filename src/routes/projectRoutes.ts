import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import TaskController from "../controllers/TaskController";

const router = Router();

router.get("/", ProjectController.getAllProjects);

router.get("/:id",
    param("id").isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    ProjectController.getProjectById);

router.post("/",
    body("projectName")
        .notEmpty().withMessage("El nombre del Proyecto es Obligatorio"),
    body("clientName")
        .notEmpty().withMessage("El nombre del Cliente es Obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripción del Proyecto es Obligatorio"),
    handleInputErrors,
    ProjectController.createProject);

router.put("/:id",
    param("id").isMongoId().withMessage("ID no válido"),
    body("projectName")
        .notEmpty().withMessage("El nombre del Proyecto es Obligatorio"),
    body("clientName")
        .notEmpty().withMessage("El nombre del Cliente es Obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripción del Proyecto es Obligatorio"),
    handleInputErrors,
    ProjectController.updateProject);

router.delete("/:id",
    param("id").isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    ProjectController.deleteProjectById);


router.post("/:projectId/task", TaskController.createTask)

export default router