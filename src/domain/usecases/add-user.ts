import { UserModel } from '../models/user.model'

export interface AddUserModel {
  username: string
  email: string
  password: string
}

export interface AddUser {
  add(user: AddUserModel): Promise<UserModel>
}