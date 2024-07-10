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
            `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmación de cuenta</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        background-color: #f7f7f7;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    h2 {
                        color: #333;
                    }
                    p {
                        color: #666;
                    }
                    .link-btn {
                        display: inline-block;
                        margin-top: 10px;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    .link-btn:hover {
                        background-color: #0056b3;
                    }
                    .timer {
                        height: 8px;
                        background: #4caf50;
                        animation: countdown 600s linear;
                        animation-fill-mode: forwards;
                        margin-top: 10px;
                        border-radius: 4px;
                    }
                    @keyframes countdown {
                        from { width: 100%; }
                        to { width: 0%; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Hola ${user.name}!</h2>
                    <p>Has creado tu cuenta en UpTask-v2. Para completar el proceso, por favor confirma tu cuenta utilizando el siguiente enlace:</p>
                    <a class="link-btn" href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                    <p>Ingresa el código: <b>${user.token}</b></p>
                    <p>Este token expira en 10 minutos.</p>
                    <div class="timer"></div>
                </div>
            </body>
            </html>
            `
        });
    };

    static sendPasswordResetToken = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: "UpTask-v2 <admin@uptask.com>",
            to: user.email,
            subject: "UpTask-v2 - Reestablecer Password",
            text: "UpTask-v2 - Reestablecer Password",
            html:
            `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reestablecer Password</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        background-color: #f7f7f7;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    }
                    h2 {
                        color: #333;
                    }
                    p {
                        color: #666;
                    }
                    .link-btn {
                        display: inline-block;
                        margin-top: 10px;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    .link-btn:hover {
                        background-color: #0056b3;
                    }
                    .timer {
                        height: 8px;
                        background: #4caf50;
                        animation: countdown 900s linear;
                        animation-fill-mode: forwards;
                        margin-top: 10px;
                        border-radius: 4px;
                    }
                    @keyframes countdown {
                        from { width: 100%; }
                        to { width: 0%; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Hola ${user.name}!</h2>
                    <p>Has solicitado reestablecer tu password. Para completar el proceso, por favor visita el siguiente enlace:</p>
                    <a class="link-btn" href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                    <p>Ingresa el código: <b>${user.token}</b></p>
                    <p>Este token expira en 15 minutos.</p>
                    <div class="timer"></div>
                </div>
            </body>
            </html>
            `
        });
    }
}
