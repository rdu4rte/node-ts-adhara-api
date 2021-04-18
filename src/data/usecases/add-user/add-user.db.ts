import { AddUser, AddUserModel } from '../../../domain/usecases/add-user'
import { Encrypter } from '../../protocols'
import { UserModel } from '../../../domain/models/user.model'

export class AddUserDb implements AddUser {
  private readonly _encrypter: Encrypter

  constructor(encrypter: Encrypter) {
    this._encrypter = encrypter
  }

  async add(user: AddUserModel): Promise<UserModel> {
    await this._encrypter.encrypt(user.password)
    return new Promise(resolve => resolve({
      id: 'valid_id',
      username: 'valid_username',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }))
  }
}