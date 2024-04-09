import { PartialType } from '@nestjs/mapped-types';
import { CreateRolDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRolDto) {}
