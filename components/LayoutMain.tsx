import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import Nav from "../islands/Nav.tsx";

export default function Layout(props: JSX.HTMLAttributes<HTMLMainElement>) {
  return (
    <>
      <Nav />
      <main class="bg-gray-50 min-h-screen flex flex-col space-y-6">
        {props.children}
      </main>
    </>
  );
}
