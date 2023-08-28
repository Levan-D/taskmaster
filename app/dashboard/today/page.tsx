/** @format */

import CreateTask from "@/app/components/tasks/taskComps/CreateTask"
import Tasks from "@/app/components/tasks/Tasks"

export default function Today() {
  return (
    <section className="m-4">
      <div className="max-w-3xl mx-auto">
        <CreateTask />
  
        <div className="mt-4">
          <Tasks />
        </div>
      </div>
    </section>
  )
}
