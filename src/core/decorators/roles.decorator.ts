import { SetMetadata } from "@nestjs/common";
import { ROLES } from "../constants/common.constants";

export const ROLES_KEY = "roles";
export const Roles = (...roles: (keyof typeof ROLES)[]) =>
  SetMetadata(ROLES_KEY, roles);
