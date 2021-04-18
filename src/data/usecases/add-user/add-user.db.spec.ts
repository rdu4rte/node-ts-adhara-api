import { Encrypter } from '../../protocols'
import { AddUserDb } from './add-user.db'
import { AddUserModel } from '../../../domain/usecases/add-user'
import { InternalServerError } from '../../../presentation/errors'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

interface SutTypes {
  sut: AddUserDb
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new AddUserDb(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('AddUserDb Usecase', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const userData: AddUserModel = {
      username: 'valid_username',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.add(userData)
    expect(encryptSpy).toHaveBeenCalledWith(userData.password)
  })

  test('should throw if Encrypt throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new InternalServerError()))
    )
    const userData: AddUserModel = {
      username: 'valid_username',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const promise = sut.add(userData)
    await expect(promise).rejects.toThrow()
  })
})
