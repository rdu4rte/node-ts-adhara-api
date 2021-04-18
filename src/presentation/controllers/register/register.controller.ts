import { AddUser, Controller, EmailValidator, HttpRequest, HttpResponse } from './register.protocol'
import { MissingParamError } from '../../errors'
import { badRequest, ok, internalServerError } from '../../helpers/http.helper'

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

      return ok(req.body)
    } catch (err) {
      return internalServerError()
    }
  }
}