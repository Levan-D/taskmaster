/** @format */

import { getMissedTasks } from "../../actions/taskActions"
import TaskDisplay from "./TaskDisplay"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Missed",
}

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Missed({ searchParams }: Props) {
  const take: number = 20
  const currentPage: number = Number(searchParams["page"]) || 0
  const skip = Math.max(0, (currentPage - 1) * take) || 0

  const tasks = await getMissedTasks({ skip: skip, take: take })
  if (!tasks.success) return <span></span>

  const pageCount = (tasks.totalCount && Math.ceil(tasks?.totalCount / take)) || 0

  return (
    <section className="h-full  max-w-3xl mx-auto ">
      {tasks.data !== undefined && (
        <TaskDisplay tasks={tasks.data} pageCount={pageCount} currentPage={currentPage} />
      )}
    </section>
  )
}
