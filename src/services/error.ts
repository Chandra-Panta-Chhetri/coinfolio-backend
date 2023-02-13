export default class ErrorService extends Error {
  statusCode?: number;

  constructor(name: string, message: string, statusCode?: number, ...params: any) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorService);
    }

    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
  }
}
