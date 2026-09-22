package com.netrareactnative.dto

import com.netra.library.Cache

data class CacheOptionsDTO(
    val ttl: Double = Cache.TTL_DEFAULT.toDouble(),
) {
    fun toDataModel(): Cache {
        return Cache(ttl.toLong())
    }

    companion object {
        fun fromDataModel(cache: Cache): CacheOptionsDTO {
            return CacheOptionsDTO(
                ttl = cache.ttl.toDouble()
            )
        }
    }
}
