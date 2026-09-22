package com.netrareactnative.dto

import com.netra.library.NetraRequestConfig
import com.netra.library.NetraResponse
import com.netra.library.enums.OfflinePolicyAction

data class RequestOptionsDTO(
    val id: String,
    val url: String,
    val offlinePolicyAction: OfflinePolicyActionDTO? = null,
    val slowNetworkPolicyAction: SlowNetworkPolicyActionDTO? = null,
    val cacheOptions: CacheOptionsDTO? = null,
    val headers: Map<String, String>?,
    val cancelOnDispose: Boolean? = false,
    val body: RequestBodyDTO?= null,
) {
    companion object {
        fun fromDataModel(config: NetraRequestConfig): RequestOptionsDTO {
            return RequestOptionsDTO(
                id = config.id,
                url = config.url,
                offlinePolicyAction = config.offlinePolicy?.let {
                    OfflinePolicyActionDTO.fromDataModel(it)
                },
                slowNetworkPolicyAction = config.slowNetworkPolicy?.let {
                    SlowNetworkPolicyActionDTO.fromDataModel(it)
                },
                cacheOptions = config.cache?.let {
                    CacheOptionsDTO.fromDataModel(it)
                },
                headers = config.headers,
                cancelOnDispose = config.cancelOnDispose,
                body = config.body?.let {
                    RequestBodyDTO.fromDataModel(it)
                },
            )
        }
    }
}
