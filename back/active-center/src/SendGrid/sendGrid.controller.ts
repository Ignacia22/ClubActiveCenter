import { Body, Controller, Post, SetMetadata } from '@nestjs/common';
import { SendGridService } from './sendGrid.service';
import { ContactFormDTO } from './sengridDTO/contactForm.dto';



@Controller('sendGrid')
export class SendGridController {
    constructor(
        private readonly sengridService: SendGridService
    ){}

    @Post("contacForm")
    @SetMetadata("isPublic", true)
    async contactMail(
        @Body()contacForm: ContactFormDTO
    ): Promise<void>{
        return await this.sengridService.contactMail(contacForm)
    }
}

