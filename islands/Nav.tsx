import { useEffect, useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";
import { Icon } from "@iconify/react";

export default function Counter(props: {}) {
  return (
    <nav class="sticky top-0 bg-blue-50 w-full py-2 px-4 flex flex-row items-center border(black 1)">
      <div class="flex-auto">
        <a href="/" class="text-3xl lg:text-5xl">K. Falentio</a>
      </div>
      <div class="">
        <Button class="h-10 w-10">
          <Icon icon="mdi:menu" />
        </Button>
      </div>
    </nav>
  );
}
