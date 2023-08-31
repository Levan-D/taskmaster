/** @format */

import { redirect } from "next/navigation"
import Link from "next/link"

export default function Dashboard() {
  return <Link href={"/dashboard/today"}></Link>
}
