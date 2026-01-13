import Room from "../../../components/room";
import { App } from "@/components/app";
import { Header } from "@/components/header";

export default function Page() {
  return (
    <Room>
      <Header />
      <App />
    </Room>
  );
}
