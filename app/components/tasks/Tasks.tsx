/** @format */

import { getTasks } from "../../actions"
import Task from "./taskComps/Task"

export default async function Tasks() {
  const tasks = await getTasks({ isDeleted: false })

  if (tasks.success && tasks.data)
    return (
      <>
        {tasks.data.length > 0 && (
          <hr className="mx-4 my-6 border-t-[1px] border-neutral-700 border-opacity-75" />
        )}
        <div className="flex flex-col gap-4">
          {tasks.data.map(task => (
            <Task key={task.id} {...task} />
          ))}
        </div>
      </>
    )
}
