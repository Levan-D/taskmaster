/** @format */

import React from "react"
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server"

export default function LogoutBtn() {
  return (
    <LogoutLink className="hover:bg-neutral-600 text-sm pl-4 pr-8 py-1.5 whitespace-nowrap rounded-md block text active:bg-neutral-700 duration-300 text-left w-full">
      Log out
    </LogoutLink>
  )
}
