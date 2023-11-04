/** @format */

import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/server"
import Icon from "@mdi/react"
import { mdiGithub } from "@mdi/js"
import Link from "next/link"

export default async function Home() {
  return (
    <section className="flex sm:min-h-screen min-h-[calc(100dvh)] flex-col items-center justify-between w-screen">
      <p className="text-3xl sm:text-5xl  lg:text-7xl font-semibold text-center max-w-6xl mt-36 mx-4 sm:mx-8">
        Your daily and weekly routine, simplified and organized.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center w-full px-8 sm:w-fit mx-auto">
        <LoginLink className="btnPrimary py-3 px-16 lg:text-lg w-full text-center">
          Sign in
        </LoginLink>
        <RegisterLink className="btnSecondary py-3 px-16 lg:text-lg w-full text-center">
          Register
        </RegisterLink>
      </div>

      <footer className="w-full">
        <div>
          <svg
            className="waves"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shapeRendering="auto"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="parallax">
              <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
              <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
              <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
              <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
            </g>
          </svg>
        </div>
        <div className="flex   flex-col-reverse sm:flex-row gap-4 justify-center items-center text-neutral-950 bg-white text-center py-8 sm:py-12">
          <div className="">© 2023 Levan Dolidze. All Rights Reserved.</div>
          <Link href={"https://github.com/Levan-D/taskmaster"} target="_blank">
            <Icon className="hover:text-sky-600 duration-300" path={mdiGithub} size={1} />
          </Link>
        </div>
      </footer>
    </section>
  )
}
