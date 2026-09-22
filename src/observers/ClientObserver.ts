import { NativeEventEmitter, NativeModules } from 'react-native';
import type { RequestOptions } from '../models';
import { ObserverListener, type ObserverCallback } from './ObserverListener';
import { RequestOptionsDTO } from '../internal/dto/RequestOptionsDTO';
import { ResponseReceivedDTO } from '../internal/dto/ResponseReceivedDTO';
import uuid from 'react-native-uuid';
import type { ResponseReceived } from '../models/Response';

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
    response?: ResponseReceived<Object | undefined>;
    exception?: string;
  };
  QueuedRequestSuccess: {
    url: string;
    response: ResponseReceived<Object | undefined>;
  };
  QueuedRequestExecuted: {
    url: string;
  };
  RequestExecuted: {
    request: RequestOptions;
  };
  RequestSuccess: {
    request: RequestOptions;
    response: ResponseReceived<Object | undefined>;
  };
  RequestFailed: {
    request: RequestOptions;
    response?: ResponseReceived<Object | undefined>;
    exception?: string;
  };
  Offline: {};
  SlowNetwork: {};
  ConnectionRestored: {};
};

type ObserverListenerMap<T> = {
  [K in keyof T]: ObserverListener<T[K]>[];
};

type EventHandlerMap<T> = {
  [K in keyof T]: () => T[K];
};

export class ClientObserver {
  private eventEmitter = new NativeEventEmitter(NativeModules.NetraReactNative);

  private listeners: ObserverListenerMap<ClientEventResponse> = {
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
    this.eventEmitter.addListener(`ClientObserver${clientId}`, (res: any) => {
      const event = JSON.parse(res);
      const name = event.EventName;
      if (Object.prototype.hasOwnProperty.call(this.listeners, name)) {
        const eventHandlers: EventHandlerMap<ClientEventResponse> = {
          CacheHit: () => ({
            request: RequestOptionsDTO.fromJSON(
              JSON.stringify(event.Value.request)
            ).toDataModel(),
            ageMs: event.Value.ageMs,
            ttlMs: event.Value.ttlMs,
          }),
          CacheMiss: () => ({
            request: RequestOptionsDTO.fromJSON(
              JSON.stringify(event.Value.request)
            ).toDataModel(),
          }),
          CacheStored: () => ({
            request: RequestOptionsDTO.fromJSON(
              JSON.stringify(event.Value.request)
            ).toDataModel(),
            ageMs: event.Value.ageMs,
            sizeByte: event.Value.ttlMs,
          }),
          CacheExpired: () => ({
            request: RequestOptionsDTO.fromJSON(
              JSON.stringify(event.Value.request)
            ).toDataModel(),
            ageMs: event.Value.ageMs,
            ttlMs: event.Value.ttlMs,
            expiredByMs: event.Value.expiredByMs,
          }),
          StaleCacheUsed: () => ({
            request: RequestOptionsDTO.fromJSON(
              JSON.stringify(event.Value.request)
            ).toDataModel(),
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
                ? ResponseReceivedDTO.fromJSON(
                    JSON.stringify(event.Value.response)
                  ).toDataModel()
                : undefined,
            exception:
              event.Value.exception !== undefined
                ? event.Value.exception
                : undefined,
          }),
          QueuedRequestSuccess: () => ({
            url: event.Value.url,
            response: ResponseReceivedDTO.fromJSON(
              JSON.stringify(event.Value.response)
            ).toDataModel(),
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
            ).toDataModel(),
            response: ResponseReceivedDTO.fromJSON(
              JSON.stringify(event.Value.response)
            ).toDataModel(),
          }),
          RequestFailed: () => ({
            request: RequestOptionsDTO.fromJSON(
              JSON.stringify(event.Value.request)
            ).toDataModel(),
            exception:
              event.Value.exception !== undefined
                ? event.Value.exception
                : undefined,
            response:
              event.Value.response !== undefined
                ? ResponseReceivedDTO.fromJSON(
                    JSON.stringify(event.Value.response)
                  ).toDataModel()
                : undefined,
          }),
          Offline: () => ({}),
          SlowNetwork: () => ({}),
          ConnectionRestored: () => ({}),
        };
        const handler = eventHandlers[name as keyof ClientEventResponse];
        const response = handler ? handler() : {};
        if (Object.keys(response).length > 0) {
          this.listeners[name as keyof ClientEventResponse]?.forEach(
            (observer: any) => {
              observer.callback(response);
            }
          );
        }
      }
    });
  }

  on(
    event: keyof ClientEventResponse,
    callback: ObserverCallback<ClientEventResponse[keyof ClientEventResponse]>
  ): string | undefined {
    if (!Object.prototype.hasOwnProperty.call(this.listeners, event)) {
      this.listeners[event] = [];
    }
    const observer = new ObserverListener(uuid.v4().toString(), callback);
    this.listeners[event]!.push(observer);
    return observer.id;
  }

  off(
    event: keyof ClientEventResponse,
    callback: ObserverCallback<ClientEventResponse[keyof ClientEventResponse]>
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
