/** @format */

import Task from "./Task"

type Props = { tasks: Task[]; expired?: boolean; className?: string }

export default async function Tasks({ tasks, expired = false, className }: Props) {
  return (
    <div className={`${className} flex flex-col gap-4`}>
      {tasks.map(task => (
        <Task expired={expired} key={task.id} {...task} />
      ))}
    </div>
  )
}
