import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string,
    name: string,
    token: string
}
export class AuthEmail {
    static sendConfirmationMail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: "UpTask-v2 <admin@uptask.com>",
            to: user.email,
            subject: "UpTask-v2 - Confirmación de Cuenta",
            text: "UpTask-v2 - Confirmación de Cuenta",
            html: 
            `<h2>Hola ${user.name}!</h2>
            <p> Has creado tu cuenta en UpTask-v2, solo debes confirmar tu cuenta</p>
            <p>Visita el siguiente enlace:</p>
            <a href="">Confirmar cuenta</a>
            <p>Ingresa el código: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
            `
        });

        console.log("Mensaje enviado", info.messageId);
    }
}
