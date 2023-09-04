/** @format */

import {
  RegisterLink,
  LoginLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"

export default function Home() {
  const { getUser, isAuthenticated } = getKindeServerSession()

  if (isAuthenticated()) redirect("/dashboard/today")

  return (
    <section className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex gap-4 items-center w-fit mx-auto">
        <>
          <LoginLink className="bg-[#3377ff] text-white px-4 py-2 rounded">
            Sign in
          </LoginLink>
          <RegisterLink className="bg-[#3377ff] text-white px-4 py-2 rounded">
            Sign up
          </RegisterLink>
        </>
      </div>
    </section>
  )
}
