import type { Request, Response } from "express"

import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

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

            // Envío de mail
            AuthEmail.sendConfirmationMail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()]);

            res.json({msg: "Cuenta creada exitosamente. Revisa tu email para confirmar cuenta"});
        } catch (error) {
            console.log(error.message);
            res.status(500).json({"msg": error});
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;
            const tokenExists = await Token.findOne({token});
            if(!tokenExists){
                const error = new Error("Token no válido");
                res.status(401).json({msg: error.message, error: true})
            }

             const user = await User.findById(tokenExists.user._id);
             user.confirmed = true;

             await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
             res.json({msg: "Cuenta confirmada exitosamente"})
        } catch (error) {
            console.log(error.message);
            res.status(500).json({"msg": error});
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({email});

            if(!user){
                const error = new Error(`No existe usuario registrado con el email: ${email}.`);
                res.status(404).json({msg: error.message, error: true})
            };

            if(!user.confirmed){
                const token = new Token();
                token.user = user.id

                token.token = generateToken();
                await token.save();

                AuthEmail.sendConfirmationMail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                });

                const error = new Error(`La cuenta no ha sido confirmada. Revisa tu email, hemos enviado un mail de confirmación de cuenta.`);
                res.status(401).json({msg: error.message, error: true})
            }

            const isPasswordCorrect = await checkPassword(password, user.password);

            if(!isPasswordCorrect){
                const error = new Error(`El password ingresado es incorrecto.`);
                res.status(401).json({msg: error.message, error: true})
            }

            res.json({msg: "Usuario autenticado correctamente"})
        } catch (error) {
            
        }
    }
}