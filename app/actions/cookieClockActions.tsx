/** @format */

"use server"
import { prisma } from "../db"
import { checkAuth, handleApiError } from "./userActions"

export const getCookieClockData = async (): Promise<ApiResponse<CookieClockType>> => {
  const userData = await checkAuth()

  try {
    if (userData && userData.id) {
      const cookieClockData = await prisma.cookieClock.findUnique({
        where: {
          user_id: userData.id,
        },
      })
      return {
        success: true,
        data: cookieClockData === null ? undefined : cookieClockData,
      }
    } else {
      throw new Error("Bad Request: Missing user data")
    }
  } catch (error) {
    return handleApiError(error)
  }
}

export const createOrUpdateCookieClock = async (
  input: CookieClockType
): Promise<ApiResponse<void>> => {
  try {
    const userData = await checkAuth()

    if (!userData || !userData.id) {
      throw new Error("Bad Request: Missing user data")
    }

    await prisma.cookieClock.upsert({
      where: {
        user_id: userData.id,
      },
      create: {
        ...input,
        user_id: userData.id,
      },
      update: {
        ...input,
      },
    })

    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}
