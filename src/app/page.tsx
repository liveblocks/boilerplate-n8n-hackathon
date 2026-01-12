import { nanoid } from "nanoid";

export default function Home() {
  return <a href={"/room/" + nanoid()}>Join a random room</a>;
}
