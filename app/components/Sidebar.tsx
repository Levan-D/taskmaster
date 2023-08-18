/** @format */

import Image from "next/image"
import { getKindeServerSession, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server"
export default function Sidebar() {
  const { isAuthenticated, getUser } = getKindeServerSession()
  const user = getUser()
  console.log(user)
  return (
    <nav className="flex justify-between items-center py-6 font-bold w-4/5 mx-auto ">
      <div className="flex gap-4 font-normal">
        {user?.picture ? (
          <Image
            className="rounded-full"
            src={user?.picture}
            width={55}
            height={55}
            alt="user profile avatar"
          />
        ) : (
          <div className="bg-[#3377ff] text-white rounded-full p-4">
            {user?.given_name?.[0]}
            {user?.family_name?.[0]}
          </div>
        )}
        <div>
          <p className="text-2xl">
            {user?.given_name} {user?.family_name}
          </p>

          <LogoutLink className="text-[#3377ff]">Log out</LogoutLink>
        </div>
      </div>
    </nav>
  )
}
