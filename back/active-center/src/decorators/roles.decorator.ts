import { SetMetadata } from "@nestjs/common";
import { Role } from "src/Auth/roles.enun";

export const Roles = (...roles:Role[]) => SetMetadata("roles", roles)