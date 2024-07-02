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

router.param("projectId", param("projectId").isMongoId().withMessage("ID no válido"));
router.param("projectId", validateProjectExists);

router.post("/:projectId/task",
    body("name")
        .notEmpty().withMessage("El nombre de la Tarea es Obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripción de la Tarea es Obligatorio"),
    handleInputErrors,
    TaskController.createTask);

router.get("/:projectId/tasks",
    TaskController.getAllTasksByProject);

router.get("/:projectId/task/:taskId",
    param("taskId").isMongoId().withMessage("ID de Tarea no válido"),
    TaskController.getTaskById);

router.put("/:projectId/task/:taskId",
    param("taskId").isMongoId().withMessage("ID de Tarea no válido"),
    body("name")
        .notEmpty().withMessage("El nombre de la Tarea es Obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripción de la Tarea es Obligatorio"),
    handleInputErrors,
    TaskController.updateTask);

router.delete("/:projectId/task/:taskId",
    param("taskId").isMongoId().withMessage("ID de Tarea no válido"),
    TaskController.deleteTask);

export default router