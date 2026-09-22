package com.netrareactnative.dto

data class CircuitBreakerOptionsDTO(
    val failureThreshold: Int? = 5,
    val retryDelayMs: Long? = 1000L
)
