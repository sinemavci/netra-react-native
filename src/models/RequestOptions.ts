import type { OfflinePolicyAction } from './OfflinePolicyAction';
import type { SlowNetworkPolicyAction } from './SlowNetworkPolicyAction';
import { CacheOptions } from './CacheOptions';
import type { RequestBody } from './RequestBody';
import 'react-native-get-random-values';
import uuid from 'react-native-uuid';
import type { ExecutionMode } from './ExecutionMode';

export interface RequestOptionsProps {
  url: string;
  offlinePolicyAction?: OfflinePolicyAction;
  slowNetworkPolicyAction?: SlowNetworkPolicyAction;
  cacheOptions?: CacheOptions;
  headers?: Map<string, string>;
  cancelOnDispose?: boolean;
  body?: RequestBody;
  executionMode?: ExecutionMode;
}

export class RequestOptions {
  id: string;
  url: string;
  offlinePolicyAction?: OfflinePolicyAction;
  slowNetworkPolicyAction?: SlowNetworkPolicyAction;
  cacheOptions?: CacheOptions;
  headers?: Map<string, string>;
  cancelOnDispose?: boolean;
  body?: RequestBody;
  executionMode?: ExecutionMode;

  constructor(props: RequestOptionsProps) {
    this.id = uuid.v4().toString();
    this.url = props.url;
    this.body = props.body;
    this.headers = props.headers;
    this.offlinePolicyAction = props.offlinePolicyAction;
    this.slowNetworkPolicyAction = props.slowNetworkPolicyAction;
    this.cacheOptions = props.cacheOptions ?? new CacheOptions();
    this.cancelOnDispose = props.cancelOnDispose ?? false;
    this.executionMode = props.executionMode;
  }
}
