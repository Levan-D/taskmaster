/** @format */

import React from "react"
import { Metadata } from "next"
import { getHabits } from "@/app/actions/taskActions"
import TaskDisplay from "./TaskDisplay"

export const metadata: Metadata = {
  title: "Habits",
}

export default async function Habits() {
  const habits = await getHabits()

  if (!habits.success) return <span></span>
  return (
    <section className="  max-w-3xl mx-auto h-full   ">
      {habits.data !== undefined && <TaskDisplay tasks={habits.data} />}
    </section>
  )
}
