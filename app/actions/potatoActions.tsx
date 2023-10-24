/** @format */

"use server"
import { prisma } from "../db"
import { revalidatePath } from "next/cache"
import { DateTime } from "luxon"
import { checkAuth, handleApiError } from "./userActions"
import { cookies } from "next/headers"

export type PotatoPacerInput = {
  workDuration: number
  restDuration: number
  bigBreakFrequency: number
  bigBreakDuration: number
  totalCycles: number
}

export const createOrUpdatePotatoPacer = async (
  input: PotatoPacerInput
): Promise<ApiResponse<void>> => {
  try {
    const userData = await checkAuth()

    if (!userData || !userData.id) {
      throw new Error("Bad Request: Missing user data")
    }

    await prisma.potatoPacer.upsert({
      where: {
        userId: userData.id,
      },
      create: {
        ...input,
        userId: userData.id,
      },
      update: {
        ...input,
      },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}
