import { nanoid } from "nanoid";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="container mx-auto mt-12 mb-4 flex flex-col gap-4 items-start p-4">
        <h1 className="text-2xl font-bold">Boilerplate for n8n hackathon</h1>
        <p>
          This is a series of mini-apps you may wish to extend when trying out
          our new n8n integration. The app has webhooks, simple auth, basic
          features setup, shadcn/ui components.
        </p>
        <ul className="list-disc *:underline *:font-medium ml-6">
          <li>
            <a href={"/comments/" + nanoid()}>Comments</a>
          </li>
          <li>
            <a href={"/text-editor/" + nanoid()}>Text Editor</a>
          </li>
          <li>
            <a href={"/builder/" + nanoid()}>Builder</a>
          </li>
          <li>
            <a href={"/tldraw/" + nanoid()}>Tldraw</a>
          </li>
        </ul>
        <h2 className="text-lg font-bold">Get started</h2>
        <ol className="list-decimal ml-6">
          <li>
            Add your secret key from the{" "}
            <a
              href="https://development.liveblocks.io/dashboard"
              className="underline font-medium"
            >
              development dashboard
            </a>{" "}
            and add it to <code>LIVEBLOCKS_SECRET_KEY</code> in{" "}
            <code>.env.local</code>
          </li>
          <li>
            <a
              href="https://liveblocks.io/docs/guides/how-to-test-webhooks-on-localhost#Testing-webhooks-locally"
              className="underline font-medium"
            >
              Set up Webhooks
            </a>{" "}
            and add your webhook secret key to{" "}
            <code>LIVEBLOCKS_WEBHOOK_SECRET_KEY</code> in{" "}
            <code>.env.local</code>
          </li>
          <li>
            Run n8n and build your app! The webhooks may he helpfful for
            triggering n8n, e.g.{" "}
            <code>app/api/liveblocks-webhook/handleCommentCreated</code>
          </li>
          <li>
            If you need more UI components, get them from shadcn/ui. For
            example, install an{" "}
            <a
              href="https://ui.shadcn.com/docs/components/accordion"
              className="underline font-medium"
            >
              Accordion
            </a>{" "}
            using <code>npx shadcn@latest add accordion</code>
          </li>
        </ol>
        <pre className="bg-foreground text-background p-4 rounded-md flex">
          <code>
            LIVEBLOCKS_SECRET_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            <br />
            LIVEBLOCKS_WEBHOOK_SECRET_KEY=whsec_xxxxxxxxxxxxxxxxxxxxx
          </code>
        </pre>
      </div>
    </div>
  );
}
