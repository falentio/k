import { Head } from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";
import Shortener from "../islands/Shortener.tsx";
import Nav from "../islands/Nav.tsx";
import LayoutMain from "../components/LayoutMain.tsx";
import Hero from "../components/Hero.tsx";

export default function Home() {
  return (
    <LayoutMain>
      <Head>
        <title>Fresh App</title>
      </Head>
      <Hero />
      <Shortener />
    </LayoutMain>
  );
}
