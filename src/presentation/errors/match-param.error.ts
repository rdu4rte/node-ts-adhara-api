export class MatchParamError extends Error {
  constructor(param1: string, param2: string) {
    super(`Params does not match: "${param1}", "${param2}"`)
    this.name = 'MatchParamError'
  }
}