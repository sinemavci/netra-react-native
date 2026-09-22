package com.netrareactnative.dto

import com.netra.library.enums.SlowNetworkPolicyAction
import kotlin.time.Duration.Companion.milliseconds

data class SlowNetworkPolicyActionDTO(
    val identifier: String,
    val delay: Double?,
    val timeout: Double?,
    val timeUnit: String?,
) {
    companion object {
        fun fromDataModel(slowNetworkPolicyAction: SlowNetworkPolicyAction): SlowNetworkPolicyActionDTO {
            return SlowNetworkPolicyActionDTO(
                identifier = slowNetworkPolicyAction.identifier,
                delay = ((if (slowNetworkPolicyAction is SlowNetworkPolicyAction.WAIT) {
                    slowNetworkPolicyAction.delay.inWholeMilliseconds
                } else {
                    null
                })?.toDouble()),
                timeout = ((if (slowNetworkPolicyAction is SlowNetworkPolicyAction.TIMEOUT) {
                    slowNetworkPolicyAction.timeout.inWholeMilliseconds
                } else {
                    null
                })?.toDouble()),
                timeUnit = ((if (slowNetworkPolicyAction is SlowNetworkPolicyAction.TIMEOUT) {
                    "MILLISECONDS"
                } else {
                    null
                }))
            )
        }
    }

    fun toDataModel(): SlowNetworkPolicyAction {
        return SlowNetworkPolicyAction.fromIdentifier(
            identifier,
            delay?.milliseconds,
            timeout?.milliseconds,
        )
    }
}
