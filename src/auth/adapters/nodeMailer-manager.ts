
import { createTransport } from 'nodemailer';
import { appConfig } from '../../core/config/config';
import { inject, injectable } from 'inversify';


@injectable()
export class NodeMailerManager {
    async sendEmailConfirmationMessage(
        email: string,
        code: string,
        template: (code: string) => string,
    ) {
        const transporter = createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true, 
            auth: {
            user: appConfig.EMAIL,
            pass: appConfig.EMAIL_PASS,
            },
        });
                
        const info = await transporter.sendMail({
        from: '"artemka" <artem.menitzky@mail.ru>', 
        to: email,
        subject: 'confirm message',
        html: template(code),
        });

        console.log("Message sent: %s", info); 
    }
}