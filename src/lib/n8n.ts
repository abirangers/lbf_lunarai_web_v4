import type { SubmissionPayload } from '@/types/submission'

interface WebhookResponse {
  success: boolean
  message?: string
  workflowId?: string
  error?: string
}

export async function dispatchToWebhook(
  payload: SubmissionPayload,
  environment: 'test' | 'production',
  retryCount: number = 0
): Promise<WebhookResponse> {
  const webhookUrl =
    environment === 'test'
      ? process.env.N8N_TEST_WEBHOOK
      : process.env.N8N_PRODUCTION_WEBHOOK

  if (!webhookUrl) {
    throw new Error(`Webhook URL not configured for ${environment} environment`)
  }

  const maxRetries = 2
  const backoffMs = Math.pow(2, retryCount) * 1000

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.N8N_WEBHOOK_SECRET && {
          'X-Webhook-Secret': process.env.N8N_WEBHOOK_SECRET,
        }),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Webhook error response:', errorText)
      throw new Error(`Webhook returned ${response.status}: ${errorText.substring(0, 200)}`)
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('Non-JSON response from webhook:', text.substring(0, 200))
      throw new Error('Webhook returned non-JSON response (likely HTML error page)')
    }

    const data = await response.json()
    return {
      success: true,
      message: data.message || 'Webhook dispatched successfully',
      workflowId: data.workflowId,
    }
  } catch (error) {
    console.error(`Webhook dispatch failed (attempt ${retryCount + 1}/${maxRetries + 1}):`, error)

    if (retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, backoffMs))
      return dispatchToWebhook(payload, environment, retryCount + 1)
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // Placeholder for signature verification
  // Implement HMAC-SHA256 verification when n8n provides signatures
  return true
}
