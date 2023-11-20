/** @format */

"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto h-full flex  w-fit flex-col justify-center ">
      <div className="mainContainer p-4">
        <h2 className="text-lg  ">Something went wrong!</h2>
        <p className=""> {`${error?.name}: ${error?.message}`}</p>

        <button
          aria-label="Refresh page"
          className="btnSecondary  w-full  mt-4"
          onClick={() => reset()}
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}
