class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export { ApiError as A };
//# sourceMappingURL=types--djZK7fU.js.map
