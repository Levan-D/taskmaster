/** @format */

"use server"
import { prisma } from "./db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

const checkAuth = async () => {
  const { getUser, isAuthenticated } = getKindeServerSession()

  const authStatus = isAuthenticated()

  if (!authStatus) {
    throw new Error("Unauthorized")
  }

  const user: UserType = getUser()
  return user
}

const handleApiError = (error: any) => {
  console.error("API Error:", error)
  return { error: error || "Internal Server Error" }
}

export const checkUserExists = async () => {
  const userData = await checkAuth()

  try {
    if (userData && userData.email && userData.id) {
      await prisma.user.upsert({
        where: { loginId: userData.id },
        update: {},
        create: {
          loginId: userData.id,
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

export const createTask = async (data: FormData) => {
  const userData = await checkAuth()

  const title = data.get("title")?.toString() || ""

  try {
    if (userData && userData.id) {
      await prisma.task.create({
        data: {
          title: title,
          priority: "LOW",
          userId: userData.id,
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

export const getTasks = async ({ deleted }: { deleted: boolean }) => {
  const userData = await checkAuth()

  try {
    if (userData && userData.id) {
      const tasks = await prisma.task.findMany({
        where: { userId: userData.id, deleted: deleted },
        orderBy: {
          creationDate: "desc",
        },
      })

      return { success: true, data: tasks }
    } else {
      throw new Error("Bad Request: Missing user data")
    }
  } catch (error) {
    return handleApiError(error)
  }
}

export const recycleTask = async ({
  taskId,
}: {
  taskId: string
}): Promise<void | { error: any }> => {
  const userData = await checkAuth()

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { deleted: true },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const toggleTaskComplete = async ({
  taskId,
  state,
}: {
  taskId: string
  state: boolean
}): Promise<void | { error: any }> => {
  const userData = await checkAuth()

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { state: state },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const setPriority = async ({
  taskId,
  priority,
}: {
  taskId: string
  priority: TaskPriority
}): Promise<void | { error: any }> => {
  const userData = await checkAuth()

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { priority: priority },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const createStep = async (data: FormData, taskId: string) => {
  const userData = await checkAuth()
  const title = data.get("title")?.toString() || ""

  try {
    await prisma.step.create({
      data: {
        title: title,
        taskId: taskId,
      },
    })
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}

export const getSteps = async ({
  taskId,
  deleted,
}: {
  taskId: string
  deleted: boolean
}) => {
  const userData = await checkAuth()

  try {
    const steps = await prisma.step.findMany({
      where: { taskId: taskId, deleted: deleted },
      orderBy: {
        creationDate: "desc",
      },
    })

    return { success: true, data: steps }
  } catch (error) {
    return handleApiError(error)
  }
}

export const recycleStep = async ({
  stepId,
}: {
  stepId: string
}): Promise<void | { error: any }> => {
  const userData = await checkAuth()

  try {
    await prisma.step.update({
      where: { id: stepId },
      data: { deleted: true },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const toggleStepComplete = async ({
  stepId,
  state,
}: {
  stepId: string
  state: boolean
}): Promise<void | { error: any }> => {
  const userData = await checkAuth()

  try {
    await prisma.step.update({
      where: { id: stepId },
      data: { state: state },
    })
  } catch (error) {
    console.error("API Error:", error)
  }
}

export const toggleComplete = async ({
  id,
  state,
}: {
  id: string
  state: boolean
}): Promise<void | { error: any }> => {
  const userData = await checkAuth()

  try {
    await prisma.step.update({
      where: { id: id },
      data: { state: state },
    })
  } catch (error) {
    console.error("API Error:", error)
  }
}
