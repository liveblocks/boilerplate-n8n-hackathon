"use client";

import { useOthers } from "@liveblocks/react";

export function App() {
  const others = useOthers();

  return <div>There are {others.length} other people online.</div>;
}
