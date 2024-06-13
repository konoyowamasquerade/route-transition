export class RequestError extends Error {
  public response?: Response;

  constructor(response: Response) {
    super();

    this.name = this.constructor.name;

    this.response = response;
  }
}
