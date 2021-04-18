import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator'

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

const validEmailMock = 'valid_email@mail.com'
const invalidEmailMock = 'invalid_email'
const anyEmailMock = 'any_email@mail.com'

describe('EmailValidator adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid(invalidEmailMock)
    expect(isValid).toBe(false)
  })

  test('should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid(validEmailMock)
    expect(isValid).toBe(true)
  })

  test('should call validator with correct email', () => {
    const sut = makeSut()
    const emailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid(anyEmailMock)
    expect(emailSpy).toHaveBeenCalledWith(anyEmailMock)
  })
})
