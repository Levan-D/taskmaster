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
    console.error("API Error:", error)
    return { error: error || "Internal Server Error" }
  }
}

export const createTask = async (data: FormData) => {
  const title = data.get("title")?.toString() || ""
  const userData = await checkAuth()

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
    console.error("API Error:", error)
    return { error: error || "Internal Server Error" }
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
    console.error("API Error:", error)
    return { error: error || "Internal Server Error" }
  }
}

export const recycleTask = async ({ taskId }: { taskId: string }): Promise<void> => {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { deleted: true },
    })
  } catch (error) {
    console.error("API Error:", error)
  }
}

export const toggleComplete = async ({
  taskId,
  state,
}: {
  taskId: string
  state: boolean
}): Promise<void> => {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {  state: state },
    })
  } catch (error) {
    console.error("API Error:", error)
  }
}
