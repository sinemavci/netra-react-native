## Netra React Native

> ⚠️ **Platform Support:** Android only. iOS is not currently supported.

Advanced networking SDK for React Native applications with offline support, slow network strategies, request lifecycle monitoring and streaming capabilities.

Netra provides a modern TypeScript API while leveraging native networking capabilities underneath.

## Netra vs Axios

Netra and Axios are designed with different goals.

Axios is a popular HTTP client for JavaScript and React Native applications, providing a simple and flexible API for making HTTP requests.

Netra focuses on building resilient network communication by providing built-in offline handling, request recovery, slow network strategies and request lifecycle management.

> 📱 Check out the [example app](./example) for a full working demo.
---

### Installation

```bash
npm install netra-react-native
```

or

```bash
yarn add netra-react-native
```

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

---

## Example Application

The example project demonstrates:

- GitHub API integration
- CRUD operations
- Offline request queue
- Retry policies
- Slow network handling
- Request observers
- Streaming image download
- Multipart image upload
- Multiple converter usage

---


The JavaScript layer provides a clean developer experience while networking operations are handled through native implementations.

---

## License

MIT License
