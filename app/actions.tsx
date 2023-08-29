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

export const createTask = async (
  data: FormData,
  priority: TaskPriority
): Promise<ApiResponse<void>> => {
  const userData = await checkAuth()

  const title = data.get("title")?.toString() || ""

  try {
    if (userData && userData.id) {
      await prisma.task.create({
        data: {
          title: title,
          userId: userData.id,
          priority: priority,
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
  id: string
): Promise<ApiResponse<void>> => {
  const title = data.get("title")?.toString() || ""

  try {
    await prisma.task.update({
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

export const getTasks = async ({
  isDeleted,
}: {
  isDeleted: boolean
}): Promise<ApiResponse<Task[]>> => {
  const userData = await checkAuth()

  try {
    if (userData && userData.id) {
      const tasks = await prisma.task.findMany({
        where: { userId: userData.id, isDeleted: isDeleted },
        include: {
          steps: {
            where: { isDeleted: isDeleted },
            orderBy: [
              {
                isComplete: "asc",
              },
              {
                creationDate: "desc",
              },
            ],
          },
        },
        orderBy: [
          {
            isComplete: "asc",
          },
          {
            creationDate: "desc",
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
      data: { isDeleted: true },
    })
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}

export const toggleTaskComplete = async ({
  taskId,
  isComplete,
}: {
  taskId: string
  isComplete: boolean
}): Promise<ApiResponse<void>> => {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { isComplete: isComplete },
    })

    if (isComplete)
      await prisma.step.updateMany({
        where: { taskId: taskId },
        data: { isComplete: true },
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
//   isDeleted,
// }: {
//   taskId: string
//   isDeleted: boolean
// }): Promise<ApiResponse<Step[]>> => {
//   try {
//     const steps = await prisma.step.findMany({
//       where: { taskId: taskId, isDeleted: isDeleted },
//       orderBy: [
//         {
//           isComplete: "asc",
//         },
//         {
//           creationDate: "desc",
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
      data: { isDeleted: true },
    })
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}

export const toggleStepComplete = async ({
  stepId,
  isComplete,
}: {
  stepId: string
  isComplete: boolean
}): Promise<ApiResponse<void>> => {
  try {
    await prisma.step.update({
      where: { id: stepId },
      data: { isComplete: isComplete },
    })
    return { success: true }
  } catch (error) {
    return handleApiError(error)
  }
}
