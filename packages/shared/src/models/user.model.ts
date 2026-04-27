import { UserEntity } from '../entities/user.entity';

export class UserModel {
  constructor(
    public username: string,
    public email: string,
    public password: string,
  ) {}

  toEntity() {
    return new UserEntity(this.username, this.email, this.password);
  }
}
