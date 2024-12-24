import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center px-4">
        <Image src="/logo.png" alt="Logo" width={84 / 1.5} height={100 / 1.5} />
      </div>
    </Link>
  );
}
