/** @format */

import Step from "./Step"
import { getSteps } from "@/app/actions"

type Props = {
  taskId: string
}

export default async function Steps({ taskId }: Props) {
  const steps = await getSteps({ taskId: taskId, deleted: false })

  if (steps.success && steps.data && steps.data.length > 0)
    return (
      <div className="innerContainer m-2      ">
        {steps.data.map(step => (
          <Step key={step.id} {...step} />
        ))}
      </div>
    )
}
