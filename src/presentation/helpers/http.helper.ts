import { InternalServerError } from '../errors'
import { HttpResponse } from '../protocols'

export const badRequest = (err: Error): HttpResponse => ({
  statusCode: 400,
  body: err
})

export const internalServerError = (): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError()
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})