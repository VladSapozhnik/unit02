export class UnauthorizedError extends Error {
  field: string;

  constructor(message: string, field: string = 'Unknown') {
    super(message);
    this.name = 'Unauthorized';
    this.field = field;
  }
}
