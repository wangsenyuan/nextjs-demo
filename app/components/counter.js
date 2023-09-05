"use client"

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>You clicked {count} times</div>
      <button onClick={() => setCount((n) => n + 1)}>Click</button>
    </div>
  );
}
