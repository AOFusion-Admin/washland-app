import { prisma } from './prisma'
import { ActivityType } from '@prisma/client'

interface ActivityData {
  type: ActivityType
  description: string
  userId?: string | null
  metadata?: Record<string, any>
}

/**
 * Utility function to log activities in the system
 * This should be called whenever important business events occur
 */
export async function logActivity(data: ActivityData) {
  try {
    await prisma.activity.create({
      data: {
        type: data.type,
        description: data.description,
        userId: data.userId || null,
        metadata: data.metadata || {}
      }
    })
  } catch (error) {
    // Log the error but don't fail the main operation
    console.error('Failed to log activity:', error)
  }
}