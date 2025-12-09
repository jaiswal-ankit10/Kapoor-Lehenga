class ApiError extends Error {
  constructor(
    statusCode,
    erros = [],
    message = "Something went wrong",
    stack = ""
  ) {
    super(message);
    this.erros = erros;
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.message = message;

    if (stack) {
      this.stack = stack;
    }
  }
}
export { ApiError };
