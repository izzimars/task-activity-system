import { BaseEntity } from "../../shared/utils/base-entity";
import { TaskStatus } from "./const";

export interface TaskEntity extends BaseEntity {
  title: string;
  description: string;
  status: TaskStatus;
  created_by: string;
}
