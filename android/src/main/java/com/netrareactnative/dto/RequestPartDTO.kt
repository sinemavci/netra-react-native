package com.netrareactnative.dto

import com.netra.library.NetraPart

data class RequestPartDTO(
    val name: String,
    val filename: String? = null,
    val body: RequestBodyDTO,
) {

    fun toDataModel(): NetraPart {
        return NetraPart(
            name = name,
            filename = filename,
            body = body.toDataModel()
        )
    }
}
