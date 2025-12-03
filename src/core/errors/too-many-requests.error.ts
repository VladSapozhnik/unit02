export class TooManyRequestsError extends Error {
  field: string;
  constructor(message: string, field: string = 'Unknown') {
    super(message);
    this.name = 'TooManyRequestsError';
    this.field = field;
  }
}
