/** @format */

import { getCompletedTasks } from "../../actions/taskActions"
import TaskDisplay from "./TaskDisplay"

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Finished({ searchParams }: Props) {
  const take: number = 2
  const currentPage: number = Number(searchParams["page"]) || 0
  const skip = Math.max(0, (currentPage - 1) * take) || 0

  const tasks = await getCompletedTasks({ deleted: false, skip: skip, take: take })

  if (!tasks.success) return <span></span>

  const pageCount = (tasks.totalCount && Math.ceil(tasks?.totalCount / take)) || 0

  return (
    <section className="  max-w-3xl mx-auto ">
      {tasks.data !== undefined && (
        <TaskDisplay tasks={tasks.data} pageCount={pageCount} currentPage={currentPage} />
      )}
    </section>
  )
}
