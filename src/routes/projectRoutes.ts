import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import TaskController from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";
import { taskBelongsToProject, validateTaskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";

const router = Router();

router.use(authenticate);

router.get("/", authenticate, ProjectController.getAllProjects);

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

router.param("projectId", param("projectId").isMongoId().withMessage("ID de Proyecto no válido"));
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


// TODO: Agregar handleInputErrors después del express-validator
// router.param("taskId", param("taskId").isMongoId().withMessage("ID de Tarea no válido"));
// Forma de Generalizar el middleware
// router.param("taskId", validateTaskExists);
// router.param("taskId", taskBelongsToProject);

router.get("/:projectId/task/:taskId",
    param("taskId").isMongoId().withMessage("ID de Tarea no válido"),
    handleInputErrors,
    validateTaskExists,
    taskBelongsToProject,
    TaskController.getTaskById);

router.put("/:projectId/task/:taskId",
    param("taskId").isMongoId().withMessage("ID de Tarea no válido"),
    body("name")
        .notEmpty().withMessage("El nombre de la Tarea es Obligatorio"),
    body("description")
        .notEmpty().withMessage("La descripción de la Tarea es Obligatorio"),
    handleInputErrors,
    validateTaskExists,
    taskBelongsToProject,
    TaskController.updateTask);

router.delete("/:projectId/task/:taskId",
    param("taskId").isMongoId().withMessage("ID de Tarea no válido"),
    handleInputErrors,
    validateTaskExists,
    taskBelongsToProject,
    TaskController.deleteTask);

router.post("/:projectId/task/:taskId/status",
    param("taskId").isMongoId().withMessage("ID de Tarea no válido"),
    body("status")
        .notEmpty().withMessage("El Estado de la Tarea es Obligatorio"),
    handleInputErrors,
    validateTaskExists,
    taskBelongsToProject,
    TaskController.updateStatus);

/** Routes for Team */
router.post("/:projectId/team/find",
    body("email")
        .notEmpty().withMessage("El e-mail es obligatorio"),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.post("/:projectId/team",
    body("id")
        .isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete("/:projectId/team/:userId",
    param("userId")
        .isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

router.get("/:projectId/team",
    TeamMemberController.getMembersProject
)

export default router