import type { Request, Response } from "express"

import User from "../models/User";
import { hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body;

            const userExists = await User.findOne({email});
            if(userExists){
                const error = new Error("Ya existe un usuario registrado con ese email");
                return res.status(409).json({msg: error.message, error: true})
            }

            // Crear Usuario
            const user = new User(req.body);

            // Hash Password
            user.password = await hashPassword(password);

            // Generar Token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;

            await Promise.allSettled([user.save(), token.save()]);

            res.json({msg: "Cuenta creada exitosamente. Revisa tu email para confirmar cuenta"});
        } catch (error) {
            console.log(error.message);
            res.status(500).json({"msg": error});
        }
    }
}