import { UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../global/mode-toggle";

type NavigationProps = {
  user?: null | User;
};

const Navigation = ({ user }: NavigationProps) => {
  return (
    <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between p-4">
      <aside className="flex items-center gap-2">
        <Image
          src="./assets/plura-logo.svg"
          width={40}
          height={40}
          alt="logo"
        />
        <span className="text-xl font-bold">Plura.</span>
      </aside>
      <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform md:block">
        <ul className="flex items-center justify-center gap-8">
          <Link href="#">Pricing</Link>
          <Link href="#">About</Link>
          <Link href="#">Documentation</Link>
          <Link href="#">Features</Link>
        </ul>
      </nav>
      <aside className="flex items-center gap-2">
        <Link
          href="/agency"
          className="rounded-md bg-primary p-2 px-4 text-white transition-all hover:bg-primary/80"
        >
          Login
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
