import { prisma } from './prisma'

export interface DuplicateCheckResult {
  isDuplicate: boolean
  field: 'email' | 'phone' | null
  existingUser?: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
  }
}

/**
 * Check if email already exists in the database
 * @param email Email to check
 * @param excludeUserId Optional user ID to exclude from check (for updates)
 * @returns Promise<DuplicateCheckResult>
 */
export async function checkEmailDuplicate(
  email: string, 
  excludeUserId?: string
): Promise<DuplicateCheckResult> {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        ...(excludeUserId && { id: { not: excludeUserId } })
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
      }
    })

    if (existingUser) {
      return {
        isDuplicate: true,
        field: 'email',
        existingUser
      }
    }

    return {
      isDuplicate: false,
      field: null
    }
  } catch (error) {
    console.error('Error checking email duplicate:', error)
    throw new Error('Failed to validate email uniqueness')
  }
}

/**
 * Check if phone number already exists in the database
 * @param phone Phone number to check
 * @param excludeUserId Optional user ID to exclude from check (for updates)
 * @returns Promise<DuplicateCheckResult>
 */
export async function checkPhoneDuplicate(
  phone: string, 
  excludeUserId?: string
): Promise<DuplicateCheckResult> {
  try {
    // Skip check if phone is empty or null
    if (!phone || phone.trim() === '') {
      return {
        isDuplicate: false,
        field: null
      }
    }

    // Normalize phone number (remove spaces, dashes, etc.)
    const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '').trim()
    
    if (normalizedPhone === '') {
      return {
        isDuplicate: false,
        field: null
      }
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        phone: normalizedPhone,
        ...(excludeUserId && { id: { not: excludeUserId } })
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
      }
    })

    if (existingUser) {
      return {
        isDuplicate: true,
        field: 'phone',
        existingUser
      }
    }

    return {
      isDuplicate: false,
      field: null
    }
  } catch (error) {
    console.error('Error checking phone duplicate:', error)
    throw new Error('Failed to validate phone uniqueness')
  }
}

/**
 * Check both email and phone for duplicates
 * @param email Email to check
 * @param phone Phone number to check
 * @param excludeUserId Optional user ID to exclude from check (for updates)
 * @returns Promise<DuplicateCheckResult>
 */
export async function checkUserDuplicates(
  email: string,
  phone?: string,
  excludeUserId?: string
): Promise<DuplicateCheckResult> {
  try {
    // Check email first
    const emailCheck = await checkEmailDuplicate(email, excludeUserId)
    if (emailCheck.isDuplicate) {
      return emailCheck
    }

    // Check phone if provided
    if (phone && phone.trim() !== '') {
      const phoneCheck = await checkPhoneDuplicate(phone, excludeUserId)
      if (phoneCheck.isDuplicate) {
        return phoneCheck
      }
    }

    return {
      isDuplicate: false,
      field: null
    }
  } catch (error) {
    console.error('Error checking user duplicates:', error)
    throw new Error('Failed to validate user uniqueness')
  }
}

/**
 * Generate user-friendly error message for duplicates
 * @param result DuplicateCheckResult
 * @returns string
 */
export function getDuplicateErrorMessage(result: DuplicateCheckResult): string {
  if (!result.isDuplicate || !result.existingUser) {
    return ''
  }

  const { existingUser, field } = result
  const userName = `${existingUser.firstName} ${existingUser.lastName}`
  const roleText = existingUser.role.replace('_', ' ').toLowerCase()

  if (field === 'email') {
    return `Email address is already registered to ${userName} (${roleText}). Please use a different email address.`
  } else if (field === 'phone') {
    return `Phone number is already registered to ${userName} (${roleText}). Please use a different phone number.`
  }

  return 'This user information is already registered in the system.'
}