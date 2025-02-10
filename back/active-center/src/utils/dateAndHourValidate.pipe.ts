import { BadRequestException } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'Confirmation',
  async: false,
})
export class ConfirmationHour implements ValidatorConstraintInterface {
  validate(
    time: string,
    args: ValidationArguments,
  ): Promise<boolean> | boolean {
    const obj = args.object as { [key: string]: any };
    const date: Date = obj[args.constraints[0]];
    const [hour, minute] = time.split(':').map(Number);
    const d: number = date.setUTCHours(hour, minute, 0, 0);
    const dateArg: Date = new Date(d);
    const dateNowArg = new Date(new Date().getTime() - 3 * 60 * 60 * 1000);
    const daysOfWeek: number = new Date(dateArg).getUTCDay();
    if (dateArg < dateNowArg)
      throw new BadRequestException(
        'No se puede retroceder en el tiempo para una fecha pasada.',
      );
    if (
      (hour <= 7 && minute <= 59) ||
      (hour >= 1 && minute >= 30 && daysOfWeek === 0)
    )
      throw new BadRequestException(
        'No se puede hacer una actividad antes de la apertura a las 7 am y tampoco una despues del cierre a las 01:30 am.',
      );
    if ((hour <= 7 && minute <= 59) || (hour >= 22 && minute >= 30))
      throw new BadRequestException(
        'No se puede hacer una actividad antes de la apertura a las 7 am y tampoco una despues del cierre a las 10:30 pm.',
      );
    return true;
  }
}
