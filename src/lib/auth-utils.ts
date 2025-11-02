import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

type UserRole = "CUSTOMER" | "STORE_ADMIN" | "FRANCHISE_ADMIN" | "SUPER_ADMIN"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole)
}

export function isSuperAdmin(userRole: UserRole): boolean {
  return userRole === "SUPER_ADMIN"
}

export function isFranchiseAdmin(userRole: UserRole): boolean {
  return userRole === "FRANCHISE_ADMIN" || userRole === "SUPER_ADMIN"
}

export function isStoreAdmin(userRole: UserRole): boolean {
  return userRole === "STORE_ADMIN" || userRole === "FRANCHISE_ADMIN" || userRole === "SUPER_ADMIN"
}

export function isCustomer(userRole: UserRole): boolean {
  return userRole === "CUSTOMER"
}

export function canManageFranchises(userRole: UserRole): boolean {
  return userRole === "SUPER_ADMIN"
}

export function canManageStores(userRole: UserRole): boolean {
  return userRole === "SUPER_ADMIN" || userRole === "FRANCHISE_ADMIN"
}

export function canViewOrders(userRole: UserRole): boolean {
  return userRole !== "CUSTOMER" || userRole === "CUSTOMER" // Customers can view their own orders
}

export function canManageOrders(userRole: UserRole): boolean {
  return userRole === "STORE_ADMIN" || userRole === "FRANCHISE_ADMIN" || userRole === "SUPER_ADMIN"
}

// Role hierarchy - higher number means more permissions
export const ROLE_HIERARCHY = {
  "CUSTOMER": 1,
  "STORE_ADMIN": 2,
  "FRANCHISE_ADMIN": 3,
  "SUPER_ADMIN": 4
}

export function hasHigherOrEqualRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}