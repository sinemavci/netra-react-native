package com.netrareactnative.dto

import com.netra.library.enums.OfflinePolicyAction
import kotlin.time.Duration.Companion.milliseconds

data class OfflinePolicyActionDTO(
    val identifier: String,
    val retries: Double?,
    val retryDuration: Double?,
    val retryUnit: String?,
) {
    companion object {
        fun fromDataModel(offlinePolicyAction: OfflinePolicyAction): OfflinePolicyActionDTO {
            return OfflinePolicyActionDTO(
                identifier = offlinePolicyAction.identifier,
                retries = ((if (offlinePolicyAction is OfflinePolicyAction.RETRY) {
                    offlinePolicyAction.retries
                } else {
                    null
                })?.toDouble()),
                retryDuration = ((if (offlinePolicyAction is OfflinePolicyAction.RETRY) {
                    offlinePolicyAction.retryInterval?.inWholeMilliseconds
                } else {
                    null
                })?.toDouble()),
                retryUnit = ((if (offlinePolicyAction is OfflinePolicyAction.RETRY) {
                    "MILLISECONDS"
                } else {
                    null
                }))
            )
        }
    }

    fun toDataModel(): OfflinePolicyAction {
        return OfflinePolicyAction.fromIdentifier(
            identifier,
            retries?.toInt(),
            retryDuration?.milliseconds,
        )
    }
}
