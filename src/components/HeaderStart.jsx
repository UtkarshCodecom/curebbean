import Image from "next/image";
import Link from "next/link";

export default function HeaderStart() {
  return (
    <header className="sticky top-0 z-10 border-b border-[#E8EEF3] bg-white/70 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/logo.png"
            alt="Curebbear"
            width={120}
            height={30}
            priority
            className="h-5 w-auto"
          />
        </Link>
        <div className="flex items-center gap-3">
         
            <Image src="/image.png" width={36} height={36} priority alt="?"/>
         
          <div className="h-10 w-10 rounded-full bg-white ring-1 ring-black/5">
            <Image
              src="/user.jpg"
              alt="Profile"
              width={36}
              height={36}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
