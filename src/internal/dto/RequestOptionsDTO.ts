import { BaseDTO } from './BaseDTO';
import { OfflinePolicyActionDTO } from './OfflinePolicyActionDTO';
import { SlowNetworkPolicyActionDTO } from './SlowNetworkPolicyActionDTO';
import { CacheOptionsDTO } from './CacheOptionsDTO';
import { RequestBodyDTO } from './RequestBodyDTO';
import { RequestOptions } from '../../models';
import { ExecutionMode } from '../../models/ExecutionMode';

export class RequestOptionsDTO extends BaseDTO {
  id: string;
  url: string;
  offlinePolicyAction?: OfflinePolicyActionDTO;
  slowNetworkPolicyAction?: SlowNetworkPolicyActionDTO;
  cacheOptions?: CacheOptionsDTO;
  headers?: Map<string, string>;
  cancelOnDispose?: boolean;
  body?: RequestBodyDTO;
  executionMode?: string;

  constructor(
    id: string,
    url: string,
    offlinePolicyAction?: OfflinePolicyActionDTO,
    slowNetworkPolicyAction?: SlowNetworkPolicyActionDTO,
    cacheOptions?: CacheOptionsDTO,
    headers?: Map<string, string>,
    cancelOnDispose?: boolean,
    body?: RequestBodyDTO,
    executionMode?: string
  ) {
    super();
    this.id = id;
    this.url = url;
    this.offlinePolicyAction = offlinePolicyAction;
    this.slowNetworkPolicyAction = slowNetworkPolicyAction;
    this.cacheOptions = cacheOptions;
    this.headers = headers;
    this.cancelOnDispose = cancelOnDispose;
    this.body = body;
    this.executionMode = executionMode;
  }

  static fromDataModel(model: RequestOptions) {
    return new RequestOptionsDTO(
      model.id,
      model.url,
      model.offlinePolicyAction !== undefined
        ? OfflinePolicyActionDTO.fromDataModel(model.offlinePolicyAction)
        : undefined,
      model.slowNetworkPolicyAction !== undefined
        ? SlowNetworkPolicyActionDTO.fromDataModel(
            model.slowNetworkPolicyAction
          )
        : undefined,
      model.cacheOptions !== undefined
        ? CacheOptionsDTO.fromDataModel(model.cacheOptions)
        : undefined,
      model.headers,
      model.cancelOnDispose,
      model.body !== undefined
        ? RequestBodyDTO.fromDataModel(model.body)
        : undefined,
      model.executionMode
    );
  }

  static fromJSON(json: string) {
    const parsedJSON = JSON.parse(json);
    return new RequestOptionsDTO(
      parsedJSON.id,
      parsedJSON.url,
      parsedJSON.offlinePolicyAction !== undefined
        ? OfflinePolicyActionDTO.fromJSON(
            JSON.stringify(parsedJSON.offlinePolicyAction)
          )
        : undefined,
      parsedJSON.slowNetworkPolicyAction !== undefined
        ? SlowNetworkPolicyActionDTO.fromJSON(
            JSON.stringify(parsedJSON.slowNetworkPolicyAction)
          )
        : undefined,
      parsedJSON.cacheOptions !== undefined
        ? CacheOptionsDTO.fromJSON(JSON.stringify(parsedJSON.cacheOptions))
        : undefined,
      parsedJSON.headers,
      parsedJSON.cancelOnDispose,
      parsedJSON.body !== undefined
        ? RequestBodyDTO.fromJSON(JSON.stringify(parsedJSON.body))
        : undefined,
      parsedJSON.executionMode
    );
  }

  toDataModel(): RequestOptions {
    return new RequestOptions({
      url: this.url,
      offlinePolicyAction: this.offlinePolicyAction?.toDataModel(),
      slowNetworkPolicyAction: this.slowNetworkPolicyAction?.toDataModel(),
      cacheOptions: this.cacheOptions?.toDataModel(),
      headers: this.headers,
      cancelOnDispose: this.cancelOnDispose,
      body: this.body?.toDataModel(),
      executionMode:
        this.executionMode === ExecutionMode.GUARANTEED
          ? ExecutionMode.GUARANTEED
          : ExecutionMode.DIRECT,
    });
  }

  toJSON() {
    return {
      id: this.id,
      url: this.url,
      offlinePolicyAction: this.offlinePolicyAction?.toJSON(),
      slowNetworkPolicyAction: this.slowNetworkPolicyAction?.toJSON(),
      cacheOptions: this.cacheOptions?.toJSON(),
      headers: this.headers,
      cancelOnDispose: this.cancelOnDispose,
      body: this.body?.toJSON(),
      executionMode: this.executionMode,
    };
  }
}
