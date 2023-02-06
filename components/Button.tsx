import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      class={`p-2 border(blue-300 2) hover:bg-blue-300 hover:text-white rounded-xl items-center justify-center flex disabled:bg-gray-300 disabled:text-gray-200 disabled:border-gray-300 ${props.class}`}
    />
  );
}
