class HttpError extends Error {
    status_code: number;

    constructor(message: string, status: number) {
      super(message);
      this.status_code = status;
      this.name = "HttpError"; // Opcional: para diferenciar este error de otros
    }
}

export default HttpError;