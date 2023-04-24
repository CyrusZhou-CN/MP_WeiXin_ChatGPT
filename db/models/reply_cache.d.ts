import { Model, BuildOptions } from 'sequelize';
export interface IReplyCacheAttributes {
  id: number,
  msgId: string,
  responseId: string,
  input: string,
  reply?: string,
  createdAt: Date,
  updatedAt: Date,
  expireAt: Date,
}
export interface IReplyCacheModel extends IReplyCacheAttributes, Model {}
export type IReplyCacheModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): IReplyCacheModel;
};