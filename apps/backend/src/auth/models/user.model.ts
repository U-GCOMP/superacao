import { UserEntity } from '../entities/user.entity';

export class UserModel {
  constructor(
    public id: string,
    public email: string,
    public password: string,
  ) {}

  toEntity() {
    return new UserEntity(this.id, this.email, this.password);
  }
}
