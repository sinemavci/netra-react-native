package com.netrareactnative.dto

import com.netra.library.NetraResponse

data class ResponseReceivedDTO(
    val data: Any?,
    val statusCode: Int,
    val statusMessage: String?,
    val isCache: Boolean?,
    val headers: Map<String, String>?,
) {
    companion object {
        fun<T> fromDataModel(response: NetraResponse.ResponseReceived<T>): ResponseReceivedDTO {
            return ResponseReceivedDTO(
                data = response.data,
                isCache = response.isCache,
                statusCode = response.statusCode,
                statusMessage = response.statusMessage,
                headers = response.headers,
            )
        }
    }

    fun toDataModel(): NetraResponse.ResponseReceived<*> {
        return NetraResponse.ResponseReceived(
            data = data,
            isCache = isCache,
            statusCode = statusCode,
            statusMessage = statusMessage,
            headers = headers,
        )
    }
}
