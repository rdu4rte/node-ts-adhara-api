import { AddUser, Controller, EmailValidator, HttpRequest, HttpResponse } from './register.protocol'
import { MissingParamError, MatchParamError, InvalidParamError } from '../../errors'
import { badRequest, internalServerError, ok } from '../../helpers/http.helper'

export class RegisterController implements Controller {
  private readonly _emailValidator: EmailValidator
  private readonly _addUser: AddUser

  constructor(emailValidator: EmailValidator, addUser: AddUser) {
    this._emailValidator = emailValidator
    this._addUser = addUser
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['username', 'email', 'password1', 'password2']
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { username, email, password1, password2 } = req.body
      if (password1 !== password2) {
        return badRequest(new MatchParamError('password1', 'password2'))
      }

      if (!this._emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const user = await this._addUser.add({
        username: username,
        email: email,
        password: password1
      })

      return ok(user)
    } catch (err) {
      return internalServerError()
    }
  }
}