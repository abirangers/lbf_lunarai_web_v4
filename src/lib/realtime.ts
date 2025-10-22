/**
 * Real-time Pub/Sub System for SSE
 *
 * Manages subscriptions and broadcasts for Server-Sent Events.
 *
 * For single-instance deployment (development/small scale):
 * - Uses in-memory Map for subscribers
 *
 * For multi-instance deployment (production/scale):
 * - Can be extended to use Redis pub/sub
 * - Set REDIS_URL environment variable to enable
 */

type Subscriber = (data: any) => void

// In-memory subscribers map
// Key: submissionId, Value: Set of subscriber callbacks
const subscribers = new Map<string, Set<Subscriber>>()

/**
 * Subscribe to updates for a specific submission
 */
export function subscribe(submissionId: string, callback: Subscriber): void {
  if (!subscribers.has(submissionId)) {
    subscribers.set(submissionId, new Set())
  }

  subscribers.get(submissionId)!.add(callback)

  console.log(
    `📡 Subscriber added for ${submissionId}. Total: ${subscribers.get(submissionId)!.size}`
  )
}

/**
 * Unsubscribe from updates
 */
export function unsubscribe(submissionId: string, callback: Subscriber): void {
  const subs = subscribers.get(submissionId)
  if (subs) {
    subs.delete(callback)
    console.log(`📡 Subscriber removed for ${submissionId}. Remaining: ${subs.size}`)

    // Clean up empty sets
    if (subs.size === 0) {
      subscribers.delete(submissionId)
      console.log(`🧹 Cleaned up empty subscriber set for ${submissionId}`)
    }
  }
}

/**
 * Broadcast section update to all subscribers
 */
export function broadcastSectionUpdate(submissionId: string, data: any): void {
  const subs = subscribers.get(submissionId)

  if (!subs || subs.size === 0) {
    console.log(`⚠️ No subscribers for ${submissionId}, skipping broadcast`)
    return
  }

  console.log(`📡 Broadcasting to ${subs.size} subscriber(s) for ${submissionId}`)

  // Send to all subscribers
  subs.forEach((callback) => {
    try {
      callback(data)
    } catch (error) {
      console.error('❌ Error broadcasting to subscriber:', error)
    }
  })
}

/**
 * Broadcast workflow completion
 */
export function broadcastCompletion(submissionId: string, summary: any): void {
  broadcastSectionUpdate(submissionId, {
    type: 'workflow_complete',
    summary,
    timestamp: new Date().toISOString(),
  })

  // Clean up subscribers after completion
  setTimeout(() => {
    subscribers.delete(submissionId)
    console.log(`🧹 Cleaned up subscribers for completed submission: ${submissionId}`)
  }, 5000) // Wait 5 seconds before cleanup
}

/**
 * Broadcast error
 */
export function broadcastError(submissionId: string, error: string): void {
  broadcastSectionUpdate(submissionId, {
    type: 'workflow_error',
    error,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Get subscriber count for a submission (for monitoring)
 */
export function getSubscriberCount(submissionId: string): number {
  return subscribers.get(submissionId)?.size || 0
}

/**
 * Get total subscriber count across all submissions (for monitoring)
 */
export function getTotalSubscribers(): number {
  let total = 0
  subscribers.forEach((subs) => {
    total += subs.size
  })
  return total
}

/**
 * Clean up stale subscribers (optional, for memory management)
 * Call this periodically if needed
 */
export function cleanupStaleSubscribers(): void {
  const now = Date.now()
  const maxAge = 15 * 60 * 1000 // 15 minutes

  // This would require tracking subscription timestamps
  // Implementation depends on your needs

  console.log('🧹 Cleanup check - current subscribers:', getTotalSubscribers())
}

// Optional: Redis-based pub/sub for multi-instance deployments
// Uncomment and configure if you need to scale horizontally

/*
import { createClient } from 'redis'

let redisPublisher: ReturnType<typeof createClient> | null = null
let redisSubscriber: ReturnType<typeof createClient> | null = null

async function initRedis() {
  if (!process.env.REDIS_URL) {
    console.log('⚠️ REDIS_URL not set, using in-memory pub/sub')
    return
  }
  
  try {
    redisPublisher = createClient({ url: process.env.REDIS_URL })
    redisSubscriber = createClient({ url: process.env.REDIS_URL })
    
    await redisPublisher.connect()
    await redisSubscriber.connect()
    
    // Subscribe to all section updates
    await redisSubscriber.subscribe('section_updates', (message) => {
      const data = JSON.parse(message)
      const { submissionId, ...eventData } = data
      
      // Broadcast to local subscribers
      const subs = subscribers.get(submissionId)
      if (subs) {
        subs.forEach(callback => callback(eventData))
      }
    })
    
    console.log('✅ Redis pub/sub initialized')
  } catch (error) {
    console.error('❌ Redis initialization failed:', error)
    console.log('⚠️ Falling back to in-memory pub/sub')
  }
}

// Call this on server start
// initRedis()

export async function broadcastSectionUpdateRedis(submissionId: string, data: any) {
  if (redisPublisher) {
    await redisPublisher.publish('section_updates', JSON.stringify({
      submissionId,
      ...data
    }))
  } else {
    // Fallback to in-memory
    broadcastSectionUpdate(submissionId, data)
  }
}
*/
