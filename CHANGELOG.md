# Changelog

## 1.0.2

- Fixed get multi stream chunk bug.
- Added exception param to RequestFailed and QueuedRequestFailed events.

## 1.0.1

Updates readme documentation.

## 1.0.0

Initial stable release.

### Added

- Added HTTP methods support:
  - GET
  - POST
  - PUT
  - PATCH
  - DELETE

- Added streaming API with `getStream` for chunk-based response handling.

- Added multipart upload support through `RequestBody.multipart`.

- Added offline request policies:
  - `queue` — stores requests and executes them when connectivity is restored
  - `retry` — retries failed requests with configurable delay
  - `useCache` — uses cached responses as fallback
  - `throwError` — returns network errors immediately

- Added slow network policies:
  - `timeout`
  - `wait`
  - `useCache`

- Added smart cache support with TTL and cache lifecycle events:
  - Cache hit
  - Cache miss
  - Cache stored
  - Cache expired
  - Stale cache used

- Added offline queue restoration support.

- Added request lifecycle observers:
  - Request events
  - Cache events
  - Queue events
  - Network events

- Added converter support:
  - Gson
  - Kotlinx Serialization
  - Moshi

- Added circuit breaker support.

- Added per-request headers.

- Added request cancellation with `cancelOnDispose`.

### Platform Support

| Platform | Support |
|---|---|
| Android | ✅ |
| iOS | 🔜 Planned |
