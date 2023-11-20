/** @format */

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center min-h-[calc(100dvh)]">
      <div className="w-fit mx-auto mainContainer p-4 px-8 text-center pb-6">
        <h1 className=" text-xl mb-4">Error 404: Page not found</h1>
        <p className="text-neutral-300 mb-4">Could not find requested resource</p>
        <Link aria-label="Return to homepage"  className="btnPrimary  " href="/">
          Return Home
        </Link>
      </div>
    </div>
  )
}
