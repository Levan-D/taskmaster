// ModalOutput.js
"use client"

import { OutPortal } from "react-reverse-portal";
import { habitModalNode, timerModalNode,cookieClockModalNode } from "./modalPortal";

export default function ModalOutput() {
  return (
    <>
      <OutPortal node={habitModalNode} />
      <OutPortal node={timerModalNode} />
      <OutPortal node={cookieClockModalNode} />
    </>
  );
}
