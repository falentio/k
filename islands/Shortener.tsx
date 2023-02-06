import { useEffect, useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

export default function Shortener(props: {}) {
  const [url, setUrl] = useState("https://google.com");
  const [err, setErr] = useState<null | Error>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | string>(null);

  return (
    <form
      class="rounded-lg shadow max-w-sm w-full mx-auto p-6 flex flex-col space-y-2 justify-items-stretch bg-blue-50"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setErr(null);
        setResult(null);

        const res = await fetch("/api/shortener", {
          body: JSON.stringify({ target: url }),
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
        });

        if (!res.ok) {
          setErr(new Error("something went wrong"));
          return;
        }

        const { slug } = await res.json();
        const u = new URL("/" + slug, window.location.href).href;
        setResult(u);
        setLoading(false);
      }}
    >
      <label class="text-xl md:text-3xl" for="url-input">
        Shorten your url {err} {url} {loading}
      </label>

      <input
        type="text"
        class="py-1 px-4 rounded-lg"
        id="url-input"
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => setUrl(e.target.value)}
        onKeyUp={(e) => setUrl(e.target.value)}
      />

      {result && (
        <div class="flex flex-row items-center">
          <span class="flex-auto overflow-x-auto">
            {result}
          </span>

          <Button
            type="button"
            onClick={() => {
              navigation?.clipboard?.writeText(result);
              setResult(null);
            }}
          >
            Copy
          </Button>
        </div>
      )}

      <Button disabled={loading}>
        Create
      </Button>
    </form>
  );
}
