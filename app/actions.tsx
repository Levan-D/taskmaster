/** @format */

"use server"
import { prisma } from "./db"

export const checkUserExits = async (user: UserType) => {
  let userData
  if (user && user.email && user.id) {
    userData = await prisma.user.upsert({
      where: { loginId: user.id }, // Use loginId to find a user
      update: {}, // Update nothing if user exists
      create: {
        loginId: user.id,
        email: user.email,
      },
    })
  }

  return userData
}

export const createTask = async (data: FormData, userId: string) => {
  const title = data.get("title")?.toString() || ""

  const user = await prisma.user.findUnique({
    where: { loginId: userId },
  })

  if (!user) {
    throw new Error("User not found")
  }

  await prisma.task.create({
    data: {
      title: title,
      priority: "LOW",
      userId: user.id,
    },
  })
}
