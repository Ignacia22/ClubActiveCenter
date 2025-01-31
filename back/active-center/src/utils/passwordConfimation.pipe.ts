import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({
  name: 'Confirmation',
  async: false,
})
export class Confirmation implements ValidatorConstraintInterface {
  validate(
    password: string,
    args: ValidationArguments,
  ): Promise<boolean> | boolean {
    const obj = args.object as { [key: string]: any };
    if (password !== obj[args.constraints[0]]) return false;
    return true;
  }
  defaultMessage(): string {
    return `Las contraseñas no coinciden.`;
  }
}
