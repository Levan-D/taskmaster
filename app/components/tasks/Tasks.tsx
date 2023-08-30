/** @format */

import { getTasks } from "../../actions"
import Task from "./taskComps/Task"

export default async function Tasks() {
  const tasks = await getTasks({ isDeleted: false })

  if (!tasks.success || !tasks.data) return <span></span>

  const totalTasks = tasks.data.length
  const tasksCompleted = tasks.data.filter(task => task.isComplete).length

  const completeTasks = totalTasks === tasksCompleted && totalTasks > 0

  return (
    <>
      {tasks.data.length > 0 && (
        <div className="flex items-center select-none">
          <hr
            className={` ${
              completeTasks ? "  border-lime-400" : "  border-neutral-500"
            } mx-4 my-12 block grow border-t-[1px] border-neutral-700 border-opacity-75`}
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
            } mx-4 my-12 block grow border-t-[1px] border-neutral-700 border-opacity-75`}
          />
        </div>
      )}
      <div>
        {tasks.data.map(task => (
          <Task key={task.id} {...task} />
        ))}
      </div>
    </>
  )
}
