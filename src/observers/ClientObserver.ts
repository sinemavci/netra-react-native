import { NativeEventEmitter, NativeModules } from 'react-native';
import type { Response, RequestOptions } from '../models';
import { ObserverListener, type ObserverCallback } from './ObserverListener';
import { RequestOptionsDTO } from '../internal/dto/RequestOptionsDTO';
import { ResponseDTO } from '../internal/dto/ResponseDTO';
import uuid from 'react-native-uuid';

export type ClientEventAllowedType =
  | 'CacheHit'
  | 'CacheMiss'
  | 'CacheStored'
  | 'CacheExpired'
  | 'StaleCacheUsed'
  | 'Offline'
  | 'SlowNetwork'
  | 'ConnectionRestored'
  | 'RequestQueued'
  | 'QueuedRequestFailed'
  | 'QueuedRequestSuccess'
  | 'QueuedRequestExecuted'
  | 'RequestExecuted'
  | 'RequestSuccess'
  | 'RequestFailed';

export type ClientEventResponse = {
  CacheHit: {
    request: RequestOptions;
    ageMs: number;
    ttlMs: number;
  };
  CacheMiss: {
    request: RequestOptions;
  };
  CacheStored: {
    request: RequestOptions;
    ageMs: number;
    sizeByte: number;
  };
  CacheExpired: {
    request: RequestOptions;
    ageMs: number;
    ttlMs: number;
    expiredByMs: number;
  };
  StaleCacheUsed: {
    request: RequestOptions;
    ageMs: number;
    ttlMs: number;
    expiredByMs: number;
  };
  RequestQueued: {
    url: string;
    queueOrder: number;
    createdAt: number;
  };
  QueuedRequestFailed: {
    url: string;
    response?: Response<Object | undefined>;
    exception?: string;
  };
  QueuedRequestSuccess: {
    url: string;
    response: Response<Object | undefined>;
  };
  QueuedRequestExecuted: {
    url: string;
  };
  RequestExecuted: {
    request: RequestOptions;
  };
  RequestSuccess: {
    request: RequestOptions;
    response: Response<Object | undefined>;
  };
  RequestFailed: {
    request: RequestOptions;
    response?: Response<Object | undefined>;
    exception?: string;
  };
  Offline: {};
  SlowNetwork: {};
  ConnectionRestored: {};
};

export class ClientObserver {
  private eventEmitter = new NativeEventEmitter(NativeModules.NetraReactNative);

  private listeners: Record<
    ClientEventAllowedType,
    ObserverListener<ClientEventResponse[ClientEventAllowedType]>[]
  > = {
    CacheHit: [],
    CacheMiss: [],
    CacheStored: [],
    CacheExpired: [],
    StaleCacheUsed: [],
    Offline: [],
    SlowNetwork: [],
    ConnectionRestored: [],
    RequestQueued: [],
    QueuedRequestFailed: [],
    QueuedRequestSuccess: [],
    QueuedRequestExecuted: [],
    RequestExecuted: [],
    RequestSuccess: [],
    RequestFailed: [],
  };

  constructor(clientId: string) {
    this.eventEmitter.addListener(`ClientListener${clientId}`, (res: any) => {
      const event = JSON.parse(res);
      const name = event.EventName;
      if (Object.prototype.hasOwnProperty.call(this.listeners, name)) {
        const eventHandlers: Record<
          ClientEventAllowedType,
          () => ClientEventResponse[ClientEventAllowedType]
        > = {
          CacheHit: () => ({
            request: RequestOptionsDTO.fromJSON(
              JSON.stringify(event.Value.request)
            ),
            ageMs: event.Value.ageMs,
            ttlMs: event.Value.ttlMs,
          }),
          CacheMiss: () => ({
            request: RequestOptionsDTO.fromJSON(
              JSON.stringify(event.Value.request)
            ),
          }),
          CacheStored: () => ({
            request: RequestOptionsDTO.fromJSON(
              JSON.stringify(event.Value.request)
            ),
            ageMs: event.Value.ageMs,
            sizeByte: event.Value.ttlMs,
          }),
          CacheExpired: () => ({
            request: RequestOptionsDTO.fromJSON(
              JSON.stringify(event.Value.request)
            ),
            ageMs: event.Value.ageMs,
            ttlMs: event.Value.ttlMs,
            expiredByMs: event.Value.expiredByMs,
          }),
          StaleCacheUsed: () => ({
            request: RequestOptionsDTO.fromJSON(
              JSON.stringify(event.Value.request)
            ),
            ageMs: event.Value.ageMs,
            ttlMs: event.Value.ttlMs,
            expiredByMs: event.Value.expiredByMs,
          }),
          RequestQueued: () => ({
            url: event.Value.url,
            queueOrder: event.Value.queueOrder,
            createdAt: event.Value.createdAt,
          }),
          QueuedRequestFailed: () => ({
            url: event.Value.url,
            response:
              event.Value.response !== undefined
                ? ResponseDTO.fromJSON(JSON.stringify(event.Value.response))
                : undefined,
            exception:
              event.Value.exception !== undefined
                ? event.Value.exception
                : undefined,
          }),
          QueuedRequestSuccess: () => ({
            url: event.Value.url,
            response: ResponseDTO.fromJSON(
              JSON.stringify(event.Value.response)
            ),
          }),
          QueuedRequestExecuted: () => ({
            url: event.Value.url,
          }),
          RequestExecuted: () => ({
            request: RequestOptionsDTO.fromJSON(
              JSON.stringify(event.Value.request)
            ).toDataModel(),
          }),
          RequestSuccess: () => ({
            request: RequestOptionsDTO.fromJSON(
              JSON.stringify(event.Value.request)
            ),
            response: ResponseDTO.fromJSON(
              JSON.stringify(event.Value.response)
            ),
          }),
          RequestFailed: () => ({
            request: RequestOptionsDTO.fromJSON(
              JSON.stringify(event.Value.request)
            ),
            exception:
              event.Value.exception !== undefined
                ? event.Value.exception
                : undefined,
            response:
              event.Value.response !== undefined
                ? ResponseDTO.fromJSON(JSON.stringify(event.Value.response))
                : undefined,
          }),
          Offline: () => ({}),
          SlowNetwork: () => ({}),
          ConnectionRestored: () => ({}),
        };
        const handler = eventHandlers[name as ClientEventAllowedType];
        const response = handler ? handler() : {};
        if (Object.keys(response).length > 0) {
          this.listeners[name as ClientEventAllowedType]?.forEach(
            (observer: any) => {
              observer.callback(response);
            }
          );
        }
      }
    });
  }

  on(
    event: ClientEventAllowedType,
    callback: ObserverCallback<ClientEventResponse[ClientEventAllowedType]>
  ): string | undefined {
    if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
      this.listeners[event] = [];
    }
    const observer = new ObserverListener(uuid.v4().toString(), callback);
    this.listeners[event]!.push(observer);
    return observer.id;
  }

  off(
    event: ClientEventAllowedType,
    callback: ObserverCallback<ClientEventResponse[ClientEventAllowedType]>
  ): string | undefined {
    if (Object.prototype.hasOwnProperty.call(this.listeners, event)) {
      const index = this.listeners[event]!.findIndex(
        (obs) => obs.callback === callback
      );

      if (index !== -1) {
        const [removedObserver] = this.listeners[event]!.splice(index, 1);

        if (this.listeners[event]!.length === 0) {
          delete this.listeners[event];
        }

        return removedObserver?.id;
      }
    }
    return;
  }
}
