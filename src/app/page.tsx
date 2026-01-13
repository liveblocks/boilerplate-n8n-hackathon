import { nanoid } from "nanoid";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div>
      <Header />
      <a href={"/room/" + nanoid()}>Join a random room</a>;
    </div>
  );
}
