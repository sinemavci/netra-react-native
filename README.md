## Netra React Native

> ⚠️ **Platform Support:** Android only. iOS is not currently supported.

Advanced networking SDK for React Native applications with offline support, slow network strategies, request lifecycle monitoring and streaming capabilities.

Netra provides a modern TypeScript API while leveraging native networking capabilities underneath.

> 📱 Check out the [example app](./example) for a full working demo.


### Installation

```bash
npm install netra-react-native
```

or

```bash
yarn add netra-react-native
```

---

## Netra vs Axios

Netra and Axios are designed with different goals.

Axios is a popular HTTP client for JavaScript and React Native applications, providing a simple and flexible API for making HTTP requests.

Netra focuses on building resilient network communication by providing built-in offline handling, request recovery, slow network strategies and request lifecycle management.

---

| Feature | Netra | Axios |
|---|---|---|
| HTTP Methods | ✅ | ✅ |
| TypeScript Support | ✅ SDK-level types | ✅ Type definitions |
| Request Interceptors | ✅ | ✅ |
| Response Interceptors | ✅ | ✅ |
| Offline Request Queue | ✅ Built-in | Not included by default |
| Queued Request Restoration | ✅ Built-in | Not included by default |
| Retry Policies | ✅ Built-in | Requires interceptor/plugin |
| Slow Network Strategies | ✅ Built-in | App-level implementation |
| Request Lifecycle Events | ✅ Observer system | Available via interceptors |
| Streaming API | ✅ Async stream API | Depends on environment |
| Multipart Upload | ✅ | ✅ |
| Serialization Support | ✅ Kotlinx / Gson / Moshi | ✅ Transformers |
| Network Resilience Features | ✅ First-class | App-level implementation |

### When to Choose Netra?

Choose Netra when your React Native application needs:

- Reliable communication under unstable network conditions
- Offline-first workflows
- Automatic request recovery
- Background synchronization
- Request state monitoring
- Advanced network policies
- Guaranteed background execution for long-running requests

Examples:

- Enterprise applications
- Field applications
- Applications used in remote locations
- Systems requiring reliable data delivery

---

### Different Design Approaches

#### Axios

```text
React Native App
        |
        |
      Axios
        |
        |
      HTTP API
```

Axios provides a flexible HTTP layer. Additional behaviors such as retries, caching, offline queues and synchronization usually need to be implemented separately.

---

#### Netra

```text
React Native App
        |
        |
   TypeScript API
        |
        |
   Native Bridge
        |
        |
Native Networking Layer
        |
        |
     Android
```

Netra treats network reliability as a built-in capability:

- Offline request queue
- Retry policies
- Slow network strategies
- Request observers
- Queue restoration

### Features

- 🚀 HTTP methods: GET, POST, PUT, PATCH, DELETE
- 📦 Offline request queue
- 🔄 Automatic retry strategies
- 🐌 Slow network handling
- ⚡ Request lifecycle observers
- 💾 Smart caching support
- 🌊 Streaming response support
- 📤 Multipart upload support
- 🔌 Native Android networking layer
- 🧩 Multiple converter support
- 🔒 Type-safe TypeScript API
- 🛡️ Guaranteed background execution for long-running requests

---

### Basic Usage

```typescript
import {
  NetraClient,
  RequestOptions,
  ConverterType,
} from 'netra-react-native';


const client = new NetraClient({
  baseUrl: 'https://api.example.com',
  converterType: ConverterType.KOTLINX,
});


const response = await client.get(
  new RequestOptions({
    url: '/users',
  })
);

console.log(response.data);

client.on(
  'RequestSuccess',
  ({ request, response }) => {

    console.log(
      request.url,
      response.statusCode
    );

  }
);
```

---

## Response Types

The examples above assume the simple, common case — the request ran and you got real data back. But not every request finishes immediately: an offline-queued or background request hasn't run yet when the call returns. To make that explicit, Netra returns a sealed `NetraResponse<T>` with two variants:

```typescript
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
}

export class ResponseQueued extends Response<never> {
  queueOrder: number;

  constructor(props: ResponseQueuedProps) {
    super();
    this.queueOrder = props.queueOrder;
  }
}
```
| Variant | When you get it |
|---|---|
| `ResponseReceived` | The normal case — the request actually ran and you have a real response (online, or served from cache) |
| `ResponseQueued` | The request was deferred instead of run immediately — either `offlinePolicyAction: OfflinePolicyAction.queue` was set and the device is offline, or `backgroundOptions`) |


> ⚠️ When `Execution Guaranteed Mode` is set, `ResponseQueued` is **always** returned — regardless of whether the device is online — because the request is handed off to a guaranteed background executor from the start rather than run inline.

## Guaranteed Execution

For requests that should survive the app being backgrounded or killed — large uploads, big downloads, anything you don't want lost if the user leaves mid-request — set `backgroundOptions`. The request is handed off to a guaranteed background executor immediately; `get`/`post`/etc. return `ResponseQueued` right away, and the real result arrives later through [Queue Events].

```dart
const response = await client.post(
  new RequestOptions({
    url: '/messages',

    body: RequestBody.createJson(
      JSON.stringify({
        message: 'Hello',
      })
    ),
    executionMode: ExecutionMode.GUARANTEED
  })
);

// result is always ResponseQueued here
```

Listen for the eventual result the same way you'd listen for offline queue events:

```typescript
netraClient.on('QueuedRequestSuccess', ({ url, response }) => {
  showSnackbar(
    `⚡ Queued Request success:${url} response: ${JSON.stringify(response.data)}`
  );
})
```

> Combining `backgroundOptions` with `offlinePolicyAction` is allowed but redundant — `backgroundOptions` already defers the request unconditionally, so the offline policy is never evaluated in that case.

---


## Offline Request Queue

Netra can automatically queue requests when the device is offline.

```typescript
const response = await client.post(
  new RequestOptions({
    url: '/messages',

    body: RequestBody.createJson(
      JSON.stringify({
        message: 'Hello',
      })
    ),

    offlinePolicyAction:
      OfflinePolicyAction.queue(),
  })
);
```

When the network becomes available, queued requests can be restored and executed automatically.

---

## Retry Strategy

Netra supports configurable retry policies for unreliable networks.

```typescript
offlinePolicyAction:
  OfflinePolicyAction.retry(
    3,
    Duration.seconds(4)
  )
```

Example flow:

```
Request
   |
Failure
   |
Wait 4 seconds
   |
Retry
   |
Retry again
```

---

## Slow Network Handling

Netra provides strategies for slow or unstable connections.

```typescript
slowNetworkPolicyAction:
  SlowNetworkPolicyAction.wait(
    Duration.seconds(5)
  )
```

Available strategies:

```typescript
SlowNetworkPolicyAction.wait()

SlowNetworkPolicyAction.timeout()

SlowNetworkPolicyAction.useCache()
```

---

## Request Lifecycle Observers

Monitor request lifecycle events.

```typescript
client.on(
  'RequestSuccess',
  ({ request, response }) => {

    console.log(
      request.url,
      response.statusCode
    );

  }
);
```

Supported events:

| Event | Description |
|---|---|
| RequestExecuted | Request execution started |
| RequestSuccess | Request completed successfully |
| RequestFailed | Request failed |
| RequestQueued | Request added to offline queue |
| QueuedRequestSuccess | Queued request executed successfully |

---

## Streaming

Netra supports streaming responses for large payloads.

```typescript
const options = new RequestOptions({
  url: '/large-file',
});


for await (
  const chunk of client.getStream(options)
) {

  console.log(chunk.length);

}
```

Useful for:

- Large files
- Images
- Media content
- Progressive downloads

---

## Multipart Upload

Upload files using multipart requests.

```typescript
const options = new RequestOptions({

  url: '/upload',

  body: RequestBody.multipart([

    RequestBodyPart.file(
      'image',
      'photo.jpg',
      bytes,
      'image/jpeg'
    )

  ])

});


await client.post(options);
```

---

## Converter Support

Netra supports multiple serialization converters.

Available converters:

- Kotlinx Serialization
- Gson
- Moshi

Example:

```typescript
const client = new NetraClient({

  baseUrl: 'https://api.example.com',

  converterType:
    ConverterType.MOSHI,

});
```

---

## Multiple Client Support

You can create multiple clients with different configurations.

```typescript
const githubClient = new NetraClient({

  baseUrl:
    'https://api.github.com',

  converterType:
    ConverterType.GSON,

});


const apiClient = new NetraClient({

  baseUrl:
    'https://api.example.com',

  converterType:
    ConverterType.KOTLINX,

});
```

## License

MIT License
