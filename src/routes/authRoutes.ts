import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

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
export default router;