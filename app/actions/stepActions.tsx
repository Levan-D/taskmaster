/** @format */

"use server"
import { prisma } from "../db"
import { revalidatePath } from "next/cache"
import { handleApiError } from "./userActions"

export const createStep = async ({
  title,
  taskId,
}: {
  title: string
  taskId: string
}): Promise<ApiResponse<void>> => {
  try {
    await prisma.steps.create({
      data: {
        title: title,
        taskId: taskId,
      },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}

export const updateStep = async ({
  title,
  stepId,
}: {
  title: string
  stepId: string
}): Promise<ApiResponse<void>> => {
  try {
    await prisma.steps.update({
      where: {
        id: stepId,
      },
      data: {
        title: title,
      },
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}

export const recycleStep = async ({
  stepId,
}: {
  stepId: string
}): Promise<ApiResponse<void>> => {
  try {
    await prisma.steps.update({
      where: { id: stepId },
      data: { deleted: true },
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}

export const toggleStepComplete = async ({
  stepId,
  complete,
}: {
  stepId: string
  complete: boolean
}): Promise<ApiResponse<void>> => {
  try {
    await prisma.steps.update({
      where: { id: stepId },
      data: { complete: complete },
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}
