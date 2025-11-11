export class ForbiddenRequestError extends Error {
  field: string;

  constructor(message: string, field: string = 'Unknown') {
    super(message);
    this.name = 'ForbiddenError';
    this.field = field;
  }
}
