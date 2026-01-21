import { nanoid } from "nanoid";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="container mx-auto mt-12 mb-4 flex flex-col gap-4 items-start p-4">
        <h1 className="text-2xl font-bold">Liveblocks Helsinki workshop</h1>
        <section className="max-w-2xl text-base opacity-80 flex flex-col gap-3">
          <p>
            This app contains a demo AI chat that you can link to n8n and extend
            yourself. It also contains a Liveblocks setup with simple
            authentication & features, along with pre-built UI components from
            shadcn/ui Vercel AI elements.
          </p>
          <p>
            Check `README.md` for more information, and click below to open a
            new chat.
          </p>
        </section>
        <Button asChild>
          <a href={"/chat/" + nanoid()}>New AI Chat</a>
        </Button>
        <h2 className="text-lg font-bold">Other applications</h2>
        <section className="max-w-2xl text-base opacity-80 flex flex-col gap-3">
          <p>
            We recommend starting with the AI chat first, but you can also try
            integrating AI into the other ready-made applications in this
            project.
          </p>
        </section>
        <section className="flex flex-row gap-2">
          <Button variant="outline" asChild>
            <a href={"/comments/" + nanoid()}>Comments</a>
          </Button>
          <Button variant="outline" asChild>
            <a href={"/text-editor/" + nanoid()}>Text Editor</a>
          </Button>
          <Button variant="outline" asChild>
            <a href={"/builder/" + nanoid()}>Builder</a>
          </Button>
          <Button variant="outline" asChild>
            <a href={"/tldraw/" + nanoid()}>Tldraw</a>
          </Button>
        </section>
      </div>
    </div>
  );
}
