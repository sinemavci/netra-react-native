package com.netrareactnative.observers

import com.facebook.react.bridge.ReactContext
import com.google.gson.Gson

class StreamObserver(val reactContext: ReactContext, val requestId: String) {
  private val jsonConverter = Gson()

  fun streamFailed() {
    NetraDeviceEventEmitter.sendEvent(
      reactContext,
      "netra_stream_error${requestId}",
      jsonConverter.toJson(true)
    )
  }

  fun sendChunk(chunk: ByteArray) {
    NetraDeviceEventEmitter.sendEvent(
      reactContext,
      "netra_stream_data${requestId}",
      jsonConverter.toJson(chunk)
    )
  }

  fun endOfStream() {
    NetraDeviceEventEmitter.sendEvent(
      reactContext,
      "netra_stream_done${requestId}",
      jsonConverter.toJson(true)
    )
  }
}
