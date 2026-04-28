import { UserModel } from '../models/user.model';

export class UserEntity {
  constructor(
    public username: string,
    public email: string,
    public password: string,
  ) {}

  toModel() {
    return new UserModel(this.username, this.email, this.password);
  }
}
