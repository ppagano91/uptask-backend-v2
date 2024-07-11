import type { Request, Response } from "express"

import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

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
                return res.status(401).json({message: error.message, error: true})
            }

             const user = await User.findById(tokenExists.user._id);
             user.confirmed = true;

             await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
             res.json({msg: "Cuenta confirmada exitosamente"})
        } catch (error) {
            res.status(500).json({"msg": error});
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({email});

            if(!user){
                const error = new Error(`No existe usuario registrado con el email: ${email}.`);
                return res.status(404).json({message: error.message, error: true})
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
                return res.status(401).json({message: error.message, error: true})
            }

            const isPasswordCorrect = await checkPassword(password, user.password);

            if(!isPasswordCorrect){
                const error = new Error(`El password ingresado es incorrecto.`);
                return res.status(401).json({message: error.message, error: true})
            }

            const token = generateJWT({id: user.id});

            res.json({msg: "Usuario autenticado correctamente", token: token})
        } catch (error) {
            res.status(500).json({"msg": error});
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({email});
            if(!user){
                const error = new Error("El usuario no está registrado");
                return res.status(404).json({message: error.message, error: true})
            }

            if(user.confirmed){
                const error = new Error("El usuario ya está confirmado");
                return res.status(403).json({message: error.message, error: true})
            }

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

            res.json({msg: "Se envió un nuevo token a su e-mail"});
        } catch (error) {
            console.log(error.message);
            res.status(500).json({"msg": error});
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({email});
            if(!user){
                const error = new Error("El usuario no está registrado");
                return res.status(404).json({message: error.message, error: true})
            }

            // Generar Token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;
            await token.save();

            // Envío de mail
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.json({msg: "Revisa tu e-mail para seguir las instrucciones"});
        } catch (error) {
            console.log(error.message);
            res.status(500).json({"msg": error});
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;
            const tokenExists = await Token.findOne({token});
            if(!tokenExists){
                const error = new Error("Token no válido");
                return res.status(401).json({message: error.message, error: true})
            }

             res.json({msg: "Token válido. Define tu nueva contraseña"})
        } catch (error) {
            res.status(500).json({"msg": error});
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            console.log(token);
            const tokenExists = await Token.findOne({token});
            console.log(tokenExists);
            if(!tokenExists){
                const error = new Error("Token no válido");
                return res.status(401).json({message: error.message, error: true})
            }

            const user = await User.findById(tokenExists.user._id);
            user.password = await hashPassword(password);

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

             res.json({msg: "La contraseña se actualizó correctamente"})
        } catch (error) {
            res.status(500).json({"msg": error});
        }
    }

    static user = async (req: Request, res: Response) => {
        try {
            return res.json({user: req.user})
        } catch (error) {
            res.status(500).json({"msg": error});
        }
    }
}