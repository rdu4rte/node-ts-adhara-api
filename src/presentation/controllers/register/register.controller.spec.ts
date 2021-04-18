import { AddUser, EmailValidator, UserModel, HttpRequest, HttpResponse } from './register.protocol'
import { RegisterController } from './register.controller'
import { MissingParamError, MatchParamError, InvalidParamError, InternalServerError } from '../../errors'

const makeEmailValidator = (): EmailValidator => {
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
  const emailValidatorStub = makeEmailValidator()
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

    const res: HttpResponse = await sut.handle(req)
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

    const res: HttpResponse = await sut.handle(req)
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const req: HttpRequest = {
      body: {
        username: 'any_username',
        email: 'any_email@mail.com',
        password2: 'any_password'
      }
    }

    const res: HttpResponse = await sut.handle(req)
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual(new MissingParamError('password1'))
  })

  test('should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()
    const req: HttpRequest = {
      body: {
        username: 'any_username',
        email: 'any_email@mail.com',
        password1: 'any_password'
      }
    }

    const res: HttpResponse = await sut.handle(req)
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual(new MissingParamError('password2'))
  })

  test('should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const req: HttpRequest = {
      body: {
        username: 'any_username',
        email: 'any_email@mail.com',
        password1: 'any_password',
        password2: 'invalid_password'
      }
    }

    const res: HttpResponse = await sut.handle(req)
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual(new MatchParamError('password1', 'password2'))
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const req: HttpRequest = {
      body: {
        username: 'any_username',
        email: 'invalid_email',
        password1: 'any_password',
        password2: 'any_password'
      }
    }

    const res: HttpResponse = await sut.handle(req)
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const validSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const req: HttpRequest = {
      body: {
        username: 'any_username',
        email: 'any_email@mail.com',
        password1: 'any_password',
        password2: 'any_password'
      }
    }
    await sut.handle(req)
    expect(validSpy).toHaveBeenCalledWith(req.body.email)
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new InternalServerError()
    })

    const req: HttpRequest = {
      body: {
        username: 'any_username',
        email: 'any_email@mail.com',
        password1: 'any_password',
        password2: 'any_password'
      }
    }
    const res: HttpResponse = await sut.handle(req)
    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual(new InternalServerError())
  })

  test('should return 500 if AddUser throws', async () => {
    const { sut, addUserStub } = makeSut()
    jest.spyOn(addUserStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new InternalServerError()))
    })
    const req: HttpRequest = {
      body: {
        username: 'any_username',
        email: 'any_email@mail.com',
        password1: 'any_password',
        password2: 'any_password'
      }
    }
    const res: HttpResponse = await sut.handle(req)
    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual(new InternalServerError())
  })
})
