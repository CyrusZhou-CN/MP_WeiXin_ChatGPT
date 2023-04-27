import { Model, BuildOptions } from 'sequelize';
export interface ISystemLogAttributes {
  id: number,
  level?: any,
  fromusername?: string,
  tousername?: string,
  message?: string,
  createdAt: Date,
  updatedAt: Date,
}
export interface ISystemLogModel extends ISystemLogAttributes, Model {}
export type ISystemLogModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ISystemLogModel;
};