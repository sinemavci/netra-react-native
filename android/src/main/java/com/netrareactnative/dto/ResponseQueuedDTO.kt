package com.netrareactnative.dto

import com.netra.library.NetraResponse

data class ResponseQueuedDTO(
    val queueOrder: Int,
) {
    companion object {
        fun fromDataModel(response: NetraResponse.ResponseQueued): ResponseQueuedDTO {
            return ResponseQueuedDTO(
                queueOrder = response.queueOrder,
            )
        }
    }

    fun toDataModel(): NetraResponse.ResponseQueued {
        return NetraResponse.ResponseQueued(
            queueOrder = queueOrder,
        )
    }
}
