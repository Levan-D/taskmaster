/** @format */

import React from "react"
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server"
import Icon from "@mdi/react"
import { mdiLogoutVariant } from "@mdi/js"

export default function LogoutBtn() {
  return (
    <LogoutLink className="hover:bg-neutral-600  flex gap-1 items-center text-sm pl-4 pr-8 py-1.5 whitespace-nowrap rounded-md  text active:bg-neutral-700 duration-300 text-left w-full">
      <Icon path={mdiLogoutVariant} size={0.7} /> <p> Log out</p>
    </LogoutLink>
  )
}
