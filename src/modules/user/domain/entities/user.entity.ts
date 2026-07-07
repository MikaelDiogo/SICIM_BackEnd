import { Role } from '../enums/role.enum';
import { Email } from '../value-objects/email.vo';

export interface UserProps {
  id: string;
  name: string;
  employeeNumber: string;
  email: Email;
  passwordHash: string;
  role: Role;
  createdAt: Date;
}

export class User {
  readonly id: string;
  readonly name: string;
  readonly employeeNumber: string;
  readonly email: Email;
  readonly passwordHash: string;
  readonly role: Role;
  readonly createdAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.employeeNumber = props.employeeNumber;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.createdAt = props.createdAt;
  }

  static create(props: Omit<UserProps, 'createdAt'>): User {
    return new User({ ...props, createdAt: new Date() });
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  hasAnyRole(...roles: Role[]): boolean {
    return roles.includes(this.role);
  }
}
