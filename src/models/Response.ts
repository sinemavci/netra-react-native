export interface ResponseReceivedProps<T> {
  data?: T;
  statusCode?: number;
  statusMessage?: string;
  headers?: Record<string, string>;
}

export interface ResponseQueuedProps {
  queueOrder: number;
}

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class Response<T> {
  protected constructor() {}
}

export class ResponseReceived<T> extends Response<T> {
  data?: T;
  statusCode?: number;
  statusMessage?: string;
  headers?: Record<string, string>;

  constructor(props: ResponseReceivedProps<T>) {
    super();
    this.data = props.data;
    this.statusCode = props.statusCode;
    this.statusMessage = props.statusMessage;
    this.headers = props.headers;
  }

  static fromRaw<T>(raw: Record<string, unknown>): ResponseReceived<T> {
    return new ResponseReceived<T>({
      data: raw.data as T,
      statusCode: raw.statusCode as number,
      statusMessage: raw.statusMessage as string,
      headers: raw.headers as Record<string, string>,
    });
  }
}

export class ResponseQueued extends Response<never> {
  queueOrder: number;

  constructor(props: ResponseQueuedProps) {
    super();
    this.queueOrder = props.queueOrder;
  }
}
