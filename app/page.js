"use client";

import { useState } from "react";

export default function Page() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>You clicked {count} times</div>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  );
}
