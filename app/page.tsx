/** @format */

import {
  RegisterLink,
  LoginLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"

export default function Home() {
  const { getUser, isAuthenticated } = getKindeServerSession()

  // redirecting to dashboard like this due to middleware bug on deployment
  if (isAuthenticated()) redirect("/dashboard/today")

  return (
    <section className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex gap-4 items-center w-fit mx-auto">
        <LoginLink className="btnPrimary py-2 px-4">Sign in</LoginLink>
        <RegisterLink className="btnSecondary py-2 px-4">Register</RegisterLink>
      </div>
    </section>
  )
}
