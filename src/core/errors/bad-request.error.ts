export class BadRequestError extends Error {
  field: string;

  constructor(message: string, field: string = 'Unknown') {
    super(message);
    this.name = 'NotFoundError';
    this.field = field;
  }
}
