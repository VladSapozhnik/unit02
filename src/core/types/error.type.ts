export type ErrorType = {
  /**
   * message and field for error
   */
  message: string;
  field: string;
};

export type ErrorResponse = {
  /**
   * response error messages
   */
  errorsMessages: ErrorType[];
};
