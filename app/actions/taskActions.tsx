"use server"
import { prisma } from "../db"
import { revalidatePath } from "next/cache"
import { DateTime } from "luxon"
import { checkAuth,handleApiError } from "./userActions"

const today = DateTime.now().startOf("day")
const yesterday = today.minus({ days: 1 }).toISO() || ""
const tomorrow = today.plus({ days: 1 }).toISO() || ""
const week = today.plus({ days: 8 }).toISO() || ""
const todayISO = today.toISO() || ""


export const createTask = async ({
    title,
    priority,
    dueDate,
  }: {
    title: string
    priority: TaskPriority
    dueDate: string
  }): Promise<ApiResponse<void>> => {
    const userData = await checkAuth()
  
    try {
      if (userData && userData.id) {
        await prisma.tasks.create({
          data: {
            title: title,
            user_id: userData.id,
            priority: priority,
            due_date: dueDate,
          },
        })
        revalidatePath("/dashboard/today")
        return { success: true }
      } else {
        throw new Error("Bad Request: Missing user data")
      }
    } catch (error) {
      return handleApiError(error)
    }
  }
  
  export const updateTask = async ({
    title,
    taskId,
    priority,
  }: {
    title: string
    taskId: string
    priority: TaskPriority
  }): Promise<ApiResponse<void>> => {
    try {
      await prisma.tasks.update({
        where: {
          id: taskId,
        },
        data: {
          title: title,
          priority: priority,
        },
      })
      revalidatePath("/dashboard/today")
      return { success: true }
    } catch (error) {
      return handleApiError(error)
    }
  }
  
  export const reviveTask = async ({
    taskId,
    dueDate,
  }: {
    taskId: string
    dueDate: string
  }): Promise<ApiResponse<void>> => {
    try {
      await prisma.tasks.update({
        where: {
          id: taskId,
        },
        data: {
          due_date: dueDate,
        },
      })
      revalidatePath("/dashboard/today")
      return { success: true }
    } catch (error) {
      return handleApiError(error)
    }
  }
  
  export const getTodaysTasks = async ({
    deleted,
  }: {
    deleted: boolean
  }): Promise<ApiResponse<Task[]>> => {
    const userData = await checkAuth()
  
    try {
      if (userData && userData.id) {
        const tasks = await prisma.tasks.findMany({
          where: {
            user_id: userData.id,
            deleted: deleted,
            due_date: {
              gte: yesterday,
              lt: tomorrow,
            },
            OR: [
              {
                AND: [{ due_date: { lt: todayISO } }, { complete: false }],
              },
              { due_date: { gte: todayISO } },
            ],
          },
  
          include: {
            steps: {
              where: { deleted: deleted },
              orderBy: [
                {
                  creation_date: "desc",
                },
              ],
            },
          },
          orderBy: [
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
  
  export const getFutureTasks = async ({
    deleted,
  }: {
    deleted: boolean
  }): Promise<ApiResponse<Task[]>> => {
    const userData = await checkAuth()
  
    try {
      if (userData && userData.id) {
        const tasks = await prisma.tasks.findMany({
          where: {
            user_id: userData.id,
            deleted: deleted,
            due_date: {
              gte: tomorrow,
              lt: week,
            },
          },
  
          include: {
            steps: {
              where: { deleted: deleted },
              orderBy: [
                {
                  creation_date: "desc",
                },
              ],
            },
          },
          orderBy: [
            {
              due_date: "asc",
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
  
  export const getCompletedTasks = async ({
    deleted,
    skip,
    take,
  }: {
    deleted: boolean
    skip: number
    take: number
  }): Promise<ApiResponse<Task[]> & { totalCount?: number }> => {
    const userData = await checkAuth()
  
    try {
      if (userData && userData.id) {
        const [tasks, totalCount] = await Promise.all([
          prisma.tasks.findMany({
            where: {
              user_id: userData.id,
              deleted: deleted,
              complete: true,
            },
            take: take,
            skip: skip,
            include: {
              steps: {
                where: { deleted: deleted },
                orderBy: [
                  {
                    creation_date: "desc",
                  },
                ],
              },
            },
            orderBy: [
              {
                due_date: "desc",
              },
              {
                creation_date: "desc",
              },
            ],
          }),
          prisma.tasks.count({
            where: {
              user_id: userData.id,
              deleted: deleted,
              complete: true,
            },
          }),
        ])
        return { success: true, data: tasks, totalCount: totalCount }
      } else {
        throw new Error("Bad Request: Missing user data")
      }
    } catch (error) {
      return handleApiError(error)
    }
  }
  
  export const getDeletedTasks = async ({
    deleted,
    skip,
  }: {
    deleted: boolean
    skip: number
  }): Promise<ApiResponse<Task[]> & { totalCount?: number }> => {
    const userData = await checkAuth()
  
    try {
      if (userData && userData.id) {
        const [tasks, totalCount] = await Promise.all([
          prisma.tasks.findMany({
            where: {
              user_id: userData.id,
              deleted: deleted,
              complete: true,
            },
            take: 41,
            skip: skip,
            include: {
              steps: {
                where: { deleted: deleted },
                orderBy: [
                  {
                    creation_date: "desc",
                  },
                ],
              },
            },
            orderBy: [
              {
                due_date: "asc",
              },
              {
                creation_date: "desc",
              },
            ],
          }),
          prisma.tasks.count({
            where: {
              user_id: userData.id,
              deleted: deleted,
              complete: true,
            },
          }),
        ])
        return { success: true, data: tasks, totalCount: totalCount }
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
      await prisma.tasks.update({
        where: { id: taskId },
        data: { deleted: true },
      })
      revalidatePath("/dashboard/today")
      return { success: true }
    } catch (error) {
      return handleApiError(error)
    }
  }
  
  export const recycleTasks = async ({
    taskIds,
  }: {
    taskIds: string[]
  }): Promise<ApiResponse<void>> => {
    try {
      await prisma.tasks.updateMany({
        where: { id: { in: taskIds } },
        data: { deleted: true },
      })
      revalidatePath("/dashboard/today")
      return { success: true }
    } catch (error) {
      return handleApiError(error)
    }
  }
  
  export const reviveTasks = async ({
    taskIds,
    dueDate,
  }: {
    taskIds: string[]
    dueDate: string
  }): Promise<ApiResponse<void>> => {
    try {
      await prisma.tasks.updateMany({
        where: { id: { in: taskIds } },
        data: { due_date: dueDate },
      })
      revalidatePath("/dashboard/today")
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
      await prisma.tasks.update({
        where: { id: taskId },
        data: { complete: complete },
      })
  
      if (complete)
        await prisma.steps.updateMany({
          where: { taskId: taskId },
          data: { complete: true },
        })
      revalidatePath("/dashboard/today")
      return { success: true }
    } catch (error) {
      return handleApiError(error)
    }
  }
  
