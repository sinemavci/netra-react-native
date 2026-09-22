import { BaseDTO } from './BaseDTO';
import { ResponseQueued } from '../../models/Response';

export class ResponseQueuedDTO extends BaseDTO {
  queueOrder: number;

  constructor(queueOrder: number) {
    super();
    this.queueOrder = queueOrder;
  }

  static fromDataModel(model: ResponseQueued): ResponseQueuedDTO {
    return new ResponseQueuedDTO(model.queueOrder);
  }

  static fromJSON(json: string) {
    const parsedJSON = JSON.parse(json);
    return new ResponseQueuedDTO(parsedJSON.queueOrder);
  }

  toDataModel(): ResponseQueued {
    return new ResponseQueued({
      queueOrder: this.queueOrder,
    });
  }

  toJSON() {
    return {
      queueOrder: this.queueOrder,
    };
  }
}
