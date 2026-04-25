import { UserModel } from '../models/user.model';

export class UserEntity {
  constructor(
    public id: string,
    public email: string,
    public password: string,
  ) {}

  toModel() {
    return new UserModel(this.id, this.email, this.password);
  }
}
