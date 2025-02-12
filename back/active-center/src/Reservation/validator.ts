import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const TIME_REGEX = /^(0[7-9]|1\d|2[0-3]):[0-5]\d$/;

@ValidatorConstraint({ name: 'MinTwoHoursDifference', async: true })
export class MinTwoHoursDifference implements ValidatorConstraintInterface {
  validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const dto = validationArguments?.object as any;
    const startTime = dto.startTime;
    const endTime = value;

    if (!TIME_REGEX.test(startTime) || !TIME_REGEX.test(endTime)) {
      return false; // Si los formatos no son válidos, no seguir con la validación
    }

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startTotalMinutes = startH * 60 + startM;
    const endTotalMinutes = endH * 60 + endM;

    return endTotalMinutes - startTotalMinutes >= 120;
  }

  defaultMessage(validationArguments: ValidationArguments) {
    return `el horario minimo de reserva es de 2 horas`;
  }
}

@ValidatorConstraint({ name: 'isEndTimeGreater', async: false })
export class IsEndTimeGreaterThanStartTime
  implements ValidatorConstraintInterface
{
  validate(
    endTime: any,
    validationArguments: ValidationArguments,
  ): Promise<boolean> | boolean {
    const { startTime } = validationArguments.object as any;
    if (!startTime || !endTime) return false;

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startTotalMinutes = startH * 60 + startM;
    const endTotalMinutes = endH * 60 + endM;

    return endTotalMinutes >= startTotalMinutes;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return 'el tiempo final debe ser mayor';
  }
}
