import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function Hero() {
  return (
    <>
    <div class="h-48 shadow w-full bg-blue-50">
      <div class="max-w-md w-full mx-auto flex flex-col text-center py-6 h-full">
        <span class="text-7xl"> K </span>
        <span> This project use Deno and Fresh stack </span>
        <span> K only had url shortener for now </span>
      </div>
    </div>
    </>
  );
}
