import { HttpRequest, HttpResponse } from './http.protocol'

export interface Controller {
  handle(req: HttpRequest): Promise<HttpResponse>
}