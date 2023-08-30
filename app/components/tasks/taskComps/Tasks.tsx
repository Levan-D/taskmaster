/** @format */

import Task from "./Task"

type Props = { tasks: Task[]; totalTasks: number; tasksCompleted: number }

export default async function Tasks({ tasks, totalTasks, tasksCompleted }: Props) {
  const completeTasks = totalTasks === tasksCompleted && totalTasks > 0

  return (
    <>
      {tasks.length > 0 && (
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
        {tasks.map(task => (
          <Task key={task.id} {...task} />
        ))}
      </div>
    </>
  )
}
