import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/create-account",
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("password")
        .notEmpty()
        .withMessage("El password es obligatorio")
        .isLength({min: 8})
        .withMessage("Mínimo 8 caracteres"),
    body("password_confirmation").custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error("Los passwords no coinciden");
        }
        return true;
    }),
    body("email").isEmail().withMessage("El formato de email no es válido"),
    handleInputErrors,
    AuthController.createAccount)

router.post("/confirm-account",
    body("token").notEmpty().withMessage("El token es obligatorio"),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post("/login",
    body("email").isEmail().withMessage("El formato de email no es válido"),
    body("password")
    .notEmpty()
    .withMessage("El password es obligatorio"),
    handleInputErrors,
    AuthController.login
)

router.post("/request-code",
    body("email").isEmail().withMessage("El formato de email no es válido"),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post("/forgot-password",
    body("email").isEmail().withMessage("El formato de email no es válido"),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post("/validate-token",
    body("token")
        .notEmpty().withMessage("El token es obligatorio"),
    handleInputErrors,
    AuthController.validateToken
)

router.post("/update-password/:token",
    param("token").isNumeric().withMessage("Token no válido"),
    body("password")
        .notEmpty()
        .withMessage("El password es obligatorio")
        .isLength({min: 8})
        .withMessage("Mínimo 8 caracteres"),
    body("password_confirmation").custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error("Los passwords no coinciden");
        }
        return true;
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.get("/user", authenticate, AuthController.user)

/** Profile */
router.put("/profile",
    authenticate,
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("El formato de email no es válido"),
    handleInputErrors,
    AuthController.updateProfile
)

router.post("/update-password",
    authenticate,
    body("current_password").notEmpty().withMessage("La nueva contraseña es obligatoria"),
    body("password")
        .notEmpty()
        .withMessage("El password es obligatorio")
        .isLength({min: 8})
        .withMessage("Mínimo 8 caracteres"),
    body("password_confirmation").custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error("Los passwords no coinciden");
        }
        return true;
    }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

export default router;