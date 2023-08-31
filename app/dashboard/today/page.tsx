/** @format */

import CreateTask from "@/app/components/tasks/taskComps/CreateTask"
import Tasks from "@/app/components/tasks/taskComps/Tasks"
import { getTasks } from "../../actions"
import { DateTime } from "luxon"
import Accordion from "@/app/components/Accordion"
import TasksRecycle from "@/app/components/tasks/taskComps/TasksRecycle"
import TasksRevive from "@/app/components/tasks/taskComps/TasksRevive"

export default async function Today() {
  const tasks = await getTasks({ deleted: false })

  if (!tasks.success) return <span></span>
  
  const today = DateTime.now().startOf("day")

  const expiredTasks =
    tasks?.data?.filter((task: Task) => {
      if (!task.due_date || task.complete) return false

      const taskDueDate = DateTime.fromISO(task.due_date).startOf("day")
      return taskDueDate.hasSame(today, "day") === false && taskDueDate < today
    }) ?? []

  const expiredTaskIds = expiredTasks.map(task => task.id)

  const todayTasks =
    tasks?.data?.filter((task: Task) => {
      if (!task.due_date) return true

      const taskDueDate = DateTime.fromISO(task.due_date).startOf("day")
      return taskDueDate.hasSame(today, "day")
    }) ?? []

  const tasksCompleted = todayTasks.filter((task: Task) => task.complete).length ?? 0
  const totalTasks = todayTasks.length
  const completeTasks = totalTasks === tasksCompleted && totalTasks > 0

  return (
    <section className="m-4 max-w-3xl mx-auto">
      <CreateTask totalTasks={todayTasks.length} />

      {expiredTasks.length > 0 && (
        <Accordion className="my-8" title={`Expired (${expiredTasks.length})`}>
          <>
            <div className="mainContainer bg-neutral-700 mt-8 mb-4 flex items-center   py-2 px-4">
              <p className="basis-3/4 text-neutral-200">
                Expired tasks will auto recycle in 7 days. Either revive, recycle, or
                complete them.
              </p>
              <TasksRevive expiredTaskIds={expiredTaskIds} className="shrink-0 mx-4 " />
              <TasksRecycle expiredTaskIds={expiredTaskIds} className="shrink-0" />
            </div>

            <Tasks expired tasks={expiredTasks} />
          </>
        </Accordion>
      )}

      {todayTasks.length > 0 && expiredTasks.length === 0 && (
        <>
          <div className="flex items-center select-none mt-10 mb-12">
            <hr
              className={` ${
                completeTasks ? "  border-lime-400" : "  border-neutral-500"
              } mx-4  block grow border-t-[1px] border-neutral-700 border-opacity-75`}
            />
            <div
              className={`${
                completeTasks ? "text-lime-400 " : "text-neutral-500 "
              }  p-1.5 text-sm  shrink-0 `}
            >
              {totalTasks}/{tasksCompleted}
            </div>
            <hr
              className={` ${
                completeTasks ? "  border-lime-400" : "  border-neutral-500"
              } mx-4    block grow border-t-[1px] border-neutral-700 border-opacity-75`}
            />
          </div>
          <Tasks className={"my-8"} tasks={todayTasks} />
        </>
      )}

      {todayTasks.length > 0 && expiredTasks.length !== 0 && (
        <Accordion className="my-8" title={`Today (${totalTasks}/${tasksCompleted})`}>
          <Tasks className={"my-8"} tasks={todayTasks} />
        </Accordion>
      )}
    </section>
  )
}
