import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import TaskController from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";

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


router.post("/:projectId/task",
    param("id").isMongoId().withMessage("ID no válido"),
    validateProjectExists,
    body("name")
        .notEmpty().withMessage("El nombre de la Tarea es Obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripción de la Tarea es Obligatorio"),
    handleInputErrors,
    TaskController.createTask);

router.get("/:projectId/tasks",
    validateProjectExists,
    TaskController.getAllTasksByProject);

export default router