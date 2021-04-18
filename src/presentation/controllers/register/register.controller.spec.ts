import { AddUser, EmailValidator, UserModel, HttpRequest } from './register.protocol'
import { RegisterController } from './register.controller'
import { MissingParamError } from '../../errors'

const makeEmailValitor = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddUser = (): AddUser => {
  class AddUserStub implements AddUser {
    async add(user: UserModel): Promise<UserModel> {
      const fakeAccount = {
        id: 'valid_id',
        username: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddUserStub()
}

interface SutTypes {
  sut: RegisterController
  emailValidatorStub: EmailValidator
  addUserStub: AddUser
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValitor()
  const addUserStub = makeAddUser()
  const sut = new RegisterController(emailValidatorStub, addUserStub)
  return {
    sut,
    emailValidatorStub,
    addUserStub
  }
}

describe('Register Controller', () => {
  test('should return 400 if no username is provided', async () => {
    const { sut } = makeSut()
    const req: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password1: 'any_password',
        password2: 'any_password'
      }
    }

    const res = await sut.handle(req)
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual(new MissingParamError('username'))
  })

  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const req: HttpRequest = {
      body: {
        username: 'any_username',
        password1: 'any_password',
        password2: 'any_password'
      }
    }

    const res = await sut.handle(req)
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual(new MissingParamError('email'))
  })
})
