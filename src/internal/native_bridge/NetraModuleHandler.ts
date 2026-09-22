import { NativeEventEmitter, NativeModules } from 'react-native';
import { Response, type RequestOptions } from '../../models';
import { RequestOptionsDTO } from '../dto/RequestOptionsDTO';
import { ResponseQueuedDTO } from '../dto/ResponseQueuedDTO';
import { ResponseReceivedDTO } from '../dto/ResponseReceivedDTO';
import NetraReactNative from './NativeNetraReactNative';
import { ExceptionManager } from '../../exceptions/ExceptionManager';

export class NetraModuleHandler {
  private emitter = new NativeEventEmitter(NativeModules.NetraReactNative);

  async get<T>(
    clientId: string,
    requestOptions: RequestOptions
  ): Promise<Response<T> | undefined> {
    let response;
    try {
      const _requestOptions =
        RequestOptionsDTO.fromDataModel(requestOptions).toJSONString();
      const responseJson = await NetraReactNative.get(
        clientId,
        _requestOptions
      );
      if (JSON.parse(responseJson).queueOrder !== undefined) {
        response = ResponseQueuedDTO.fromJSON(responseJson);
      } else {
        response = ResponseReceivedDTO.fromJSON(responseJson).toDataModel<T>();
      }
    } catch (e) {
      throw ExceptionManager.parse(e);
    }
    return response;
  }

  async post<T>(
    clientId: string,
    requestOptions: RequestOptions
  ): Promise<Response<T> | undefined> {
    let response;
    try {
      const _requestOptions =
        RequestOptionsDTO.fromDataModel(requestOptions).toJSONString();
      const responseJson = await NetraReactNative.post(
        clientId,
        _requestOptions
      );
      if (JSON.parse(responseJson).queueOrder !== undefined) {
        response = ResponseQueuedDTO.fromJSON(responseJson);
      } else {
        response = ResponseReceivedDTO.fromJSON(responseJson).toDataModel<T>();
      }
    } catch (e) {
      throw ExceptionManager.parse(e);
    }
    return response;
  }

  async put<T>(
    clientId: string,
    requestOptions: RequestOptions
  ): Promise<Response<T> | undefined> {
    let response;
    try {
      const _requestOptions =
        RequestOptionsDTO.fromDataModel(requestOptions).toJSONString();
      const responseJson = await NetraReactNative.put(
        clientId,
        _requestOptions
      );
      if (JSON.parse(responseJson).queueOrder !== undefined) {
        response = ResponseQueuedDTO.fromJSON(responseJson);
      } else {
        response = ResponseReceivedDTO.fromJSON(responseJson).toDataModel<T>();
      }
    } catch (e) {
      throw ExceptionManager.parse(e);
    }
    return response;
  }

  async patch<T>(
    clientId: string,
    requestOptions: RequestOptions
  ): Promise<Response<T> | undefined> {
    let response;
    try {
      const _requestOptions =
        RequestOptionsDTO.fromDataModel(requestOptions).toJSONString();
      const responseJson = await NetraReactNative.patch(
        clientId,
        _requestOptions
      );
      if (JSON.parse(responseJson).queueOrder !== undefined) {
        response = ResponseQueuedDTO.fromJSON(responseJson);
      } else {
        response = ResponseReceivedDTO.fromJSON(responseJson).toDataModel<T>();
      }
    } catch (e) {
      throw ExceptionManager.parse(e);
    }
    return response;
  }

  async delete<T>(
    clientId: string,
    requestOptions: RequestOptions
  ): Promise<Response<T> | undefined> {
    let response;
    try {
      const _requestOptions =
        RequestOptionsDTO.fromDataModel(requestOptions).toJSONString();
      const responseJson = await NetraReactNative.delete(
        clientId,
        _requestOptions
      );
      if (JSON.parse(responseJson).queueOrder !== undefined) {
        response = ResponseQueuedDTO.fromJSON(responseJson);
      } else {
        response = ResponseReceivedDTO.fromJSON(responseJson).toDataModel<T>();
      }
    } catch (e) {
      throw ExceptionManager.parse(e);
    }
    return response;
  }

  async build(
    baseUrl: string,
    convertedType?: string,
    headers?: string,
    circuitBreakerOptions?: string
  ) {
    let clientId;
    try {
      clientId = NetraReactNative.build(
        baseUrl,
        convertedType,
        headers,
        circuitBreakerOptions
      );
    } catch (e) {
      throw ExceptionManager.parse(e);
    }
    return clientId;
  }

  async *getStream(
    clientId: string,
    requestOptions: RequestOptions
  ): AsyncGenerator<number[]> {
    try {
      const _requestOptions =
        RequestOptionsDTO.fromDataModel(requestOptions).toJSONString();
      const chunks: number[][] = [];
      let done = false;
      let error: Error | null = null;
      this.emitter.addListener(
        `netra_stream_data${requestOptions.id}`,
        (chunk) => {
          chunks.push(JSON.parse(chunk as string) as number[]);
        }
      );

      this.emitter.addListener(`netra_stream_done${requestOptions.id}`, () => {
        done = true;
      });

      this.emitter.addListener(
        `netra_stream_error${requestOptions.id}`,
        (e) => {
          error = new Error('stream error', e);
          done = true;
        }
      );

      NetraReactNative.getStream(clientId, _requestOptions);
      while (!done) {
        while (chunks.length > 0) {
          yield chunks.shift()!;
        }
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 16);
        });
      }

      if (error) throw error;
      while (chunks.length > 0) {
        yield chunks.shift()!;
      }
    } catch (e) {
      throw ExceptionManager.parse(e);
    }
  }

  async on(clientId: string, eventId: string, eventName: string) {
    try {
      await NetraReactNative.on(clientId, eventName, eventId);
    } catch (e) {
      throw ExceptionManager.parse(e);
    }
    return clientId;
  }

  async off(clientId: string, eventId: string) {
    try {
      await NetraReactNative.off(clientId, eventId);
    } catch (e) {
      throw ExceptionManager.parse(e);
    }
    return clientId;
  }
}
