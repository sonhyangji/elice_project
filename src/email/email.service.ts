import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
    private nodemailerTransporter: Mail;

    constructor(
        private readonly configService : ConfigService
    ){
        this.nodemailerTransporter = createTransport({
            service: configService.get<string>("EMAIL_SERVICE"),
            auth:{
                user: configService.get<string>("EMAIL_USER"),
                pass: configService.get<string>("EMAIL_PASSWORD"),
            }
        })
    }

    sendEmail(options: Mail.Options){
        return this.nodemailerTransporter.sendMail(options);
    }
}
