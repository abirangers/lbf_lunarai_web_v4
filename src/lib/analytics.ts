interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
  metadata?: Record<string, any>
}

export function logEvent(event: AnalyticsEvent) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    ...event,
  }

  // Console logging for development
  console.log('[Analytics]', logEntry)

  // Placeholder for external analytics service
  if (process.env.ANALYTICS_ENDPOINT) {
    fetch(process.env.ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry),
    }).catch((err) => console.error('Analytics dispatch failed:', err))
  }
}

export function logSubmission(submissionId: string, environment: string) {
  logEvent({
    action: 'submission_created',
    category: 'workflow',
    label: environment,
    metadata: { submissionId },
  })
}

export function logWebhookCallback(submissionId: string, status: string) {
  logEvent({
    action: 'webhook_callback',
    category: 'workflow',
    label: status,
    metadata: { submissionId },
  })
}

export function logFormInteraction(fieldName: string, action: string) {
  logEvent({
    action: 'form_interaction',
    category: 'user',
    label: `${fieldName}_${action}`,
  })
}

export function logReportView(submissionId: string) {
  logEvent({
    action: 'report_viewed',
    category: 'engagement',
    metadata: { submissionId },
  })
}

export function logExport(submissionId: string, format: string) {
  logEvent({
    action: 'report_exported',
    category: 'engagement',
    label: format,
    metadata: { submissionId },
  })
}
