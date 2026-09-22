import { BaseDTO } from './BaseDTO';
import { ResponseReceived } from '../../models/Response';

export class ResponseReceivedDTO extends BaseDTO {
  data?: unknown;
  statusCode?: number;
  statusMessage?: string;
  headers?: Record<string, string>;

  constructor(
    data?: unknown,
    statusCode?: number,
    statusMessage?: string,
    headers?: Record<string, string>
  ) {
    super();
    this.data = data;
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.headers = headers;
  }

  static fromDataModel<T>(model: ResponseReceived<T>): ResponseReceivedDTO {
    return new ResponseReceivedDTO(
      model.data,
      model.statusCode,
      model.statusMessage,
      model.headers
    );
  }

  static fromJSON(json: string) {
    const parsedJSON = JSON.parse(json);
    return new ResponseReceivedDTO(
      parsedJSON.data,
      parsedJSON.statusCode,
      parsedJSON.statusMessage,
      parsedJSON.headers
    );
  }

  toDataModel<T>(): ResponseReceived<T> {
    return ResponseReceived.fromRaw<T>({
      data: this.data,
      statusCode: this.statusCode,
      statusMessage: this.statusMessage,
      headers: this.headers,
    });
  }

  toJSON() {
    return {
      data: this.data,
      statusCode: this.statusCode,
      statusMessage: this.statusMessage,
      headers: this.headers,
    };
  }
}
