/** @format */
"use server"
import { prisma } from "../db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export const checkAuth = async () => {
  const { getUser, isAuthenticated } = getKindeServerSession()

  const authStatus = isAuthenticated()

  if (!authStatus) {
    throw new Error("Unauthorized")
  }

  const user: UserType = getUser()
  return user
}

export const handleApiError = <T,>(error: any): ApiResponse<T> => {
  console.error("API Error:", error)
  return { success: false, error: error || "Internal Server Error" }
}

export const checkUserExists = async () => {
  const userData = await checkAuth()

  try {
    if (userData && userData.email && userData.id) {
      await prisma.users.upsert({
        where: { user_id: userData.id },
        update: {},
        create: {
          user_id: userData.id,
          email: userData.email,
        },
      })
      return { success: true }
    } else {
      throw new Error("Bad Request: Missing user data")
    }
  } catch (error) {
    return handleApiError(error)
  }
}
