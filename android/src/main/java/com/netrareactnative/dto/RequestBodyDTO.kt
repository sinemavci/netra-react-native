package com.netrareactnative.dto

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.netra.library.NetraPart
import com.netra.library.NetraRequestBody
import java.lang.reflect.Type
import java.util.ArrayList
import kotlin.collections.List

data class RequestBodyDTO(
    val content: Any,
    val contentType: String = "application/json; charset=utf-8",
    val isMultipart: Boolean = false,
    val type: String,
) {
    fun toDataModel(): NetraRequestBody {
        return if (!isMultipart) {
            when (type) {
                "map" -> NetraRequestBody.create(content as Map<String, Any?>)
                "raw" -> {
                  val base64 = content as String
                  val bytes = android.util.Base64.decode(base64, android.util.Base64.DEFAULT)
                  NetraRequestBody.create(bytes, contentType)
                }

                else -> NetraRequestBody.create(content as String, contentType)
            }
        } else {
            val listType: Type = object : TypeToken<List<RequestPartDTO>>() {}.type
            val featureDTOList: List<RequestPartDTO> = Gson().fromJson(content as String, listType)
            val data: List<NetraPart> = featureDTOList.map { it.toDataModel() }
            NetraRequestBody.multipart(data)
        }
    }

    companion object {
        fun fromDataModel(body: NetraRequestBody): RequestBodyDTO {
            var type = "json"
            if (body.content is Map<*, *>) {
                type = "map"
            } else if (body.content is ArrayList<*> || body.content is ByteArray) {
                type = "raw"
            }
            return RequestBodyDTO(
                content = body.content,
                contentType = body.contentType,
                isMultipart = body.isMultipart,
                type = type
            )
        }
    }
}
