import { IsUUID } from 'class-validator';

export class ApprovePropertyDto {
  // Temporary: will be extracted from the authenticated user (JWT guard) once the auth module exists.
  @IsUUID()
  approvedById: string;
}
