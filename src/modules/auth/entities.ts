import { BaseEntity } from "../../shared/utils/base-entity";

export interface UserEntity extends BaseEntity {
  email: string;
  password_hash: string;
}
