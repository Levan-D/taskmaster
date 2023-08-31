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

const handleApiError = <T,>(error: any): ApiResponse<T> => {
  console.error("API Error:", error)
  return { success: false, error: error || "Internal Server Error" }
}

type ApiResponse<T> = { success: boolean; data?: T; error?: any }

export const checkUserExists = async () => {
  const userData = await checkAuth()

  try {
    if (userData && userData.email && userData.id) {
      await prisma.user.upsert({
        where: { login_id: userData.id },
        update: {},
        create: {
          login_id: userData.id,
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

export const createTask = async (
  data: FormData,
  priority: TaskPriority,
  today: string
): Promise<ApiResponse<void>> => {
  const userData = await checkAuth()

  const title = data.get("title")?.toString() || ""

  try {
    if (userData && userData.id) {
      await prisma.task.create({
        data: {
          title: title,
          user_id: userData.id,
          priority: priority,
          due_date: today,
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

export const updateTask = async (
  data: FormData,
  id: string,
  priority: TaskPriority
): Promise<ApiResponse<void>> => {
  const title = data.get("title")?.toString() || ""

  try {
    await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        priority: priority,
      },
    })
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}

export const getTasks = async ({
  deleted,
}: {
  deleted: boolean
}): Promise<ApiResponse<Task[]>> => {
  const userData = await checkAuth()

  try {
    if (userData && userData.id) {
      const tasks = await prisma.task.findMany({
        where: { user_id: userData.id, deleted: deleted },
        include: {
          steps: {
            where: { deleted: deleted },
            orderBy: [
              {
                complete: "asc",
              },
              {
                creation_date: "desc",
              },
            ],
          },
        },
        orderBy: [
          {
            complete: "asc",
          },
          {
            creation_date: "desc",
          },
        ],
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
}): Promise<ApiResponse<void>> => {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { deleted: true },
    })
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}

export const toggleTaskComplete = async ({
  taskId,
  complete,
}: {
  taskId: string
  complete: boolean
}): Promise<ApiResponse<void>> => {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { complete: complete },
    })

    if (complete)
      await prisma.step.updateMany({
        where: { taskId: taskId },
        data: { complete: true },
      })
    return { success: true }
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
}): Promise<ApiResponse<void>> => {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { priority: priority },
    })
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}

export const createStep = async (
  data: FormData,
  taskId: string
): Promise<ApiResponse<void>> => {
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

export const updateStep = async (
  data: FormData,
  id: string
): Promise<ApiResponse<void>> => {
  const title = data.get("title")?.toString() || ""

  try {
    await prisma.step.update({
      where: {
        id: id,
      },
      data: {
        title: title,
      },
    })
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}

// atm we are getting steps only with tasks

// export const getSteps = async ({
//   taskId,
//   deleted,
// }: {
//   taskId: string
//   deleted: boolean
// }): Promise<ApiResponse<Step[]>> => {
//   try {
//     const steps = await prisma.step.findMany({
//       where: { taskId: taskId, deleted: deleted },
//       orderBy: [
//         {
//           complete: "asc",
//         },
//         {
//           creation_date: "desc",
//         },
//       ],
//     })

//     return { success: true, data: steps }
//   } catch (error) {
//     return handleApiError(error)
//   }
// }

export const recycleStep = async ({
  stepId,
}: {
  stepId: string
}): Promise<ApiResponse<void>> => {
  try {
    await prisma.step.update({
      where: { id: stepId },
      data: { deleted: true },
    })
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
    await prisma.step.update({
      where: { id: stepId },
      data: { complete: complete },
    })
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}
