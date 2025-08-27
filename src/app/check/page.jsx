import GateForm from "@/components/GateForm";

export const metadata = { title: "Private Beta Access • Curebbear" };

export default function GatePage({ searchParams }) {
  const nextUrl = searchParams?.next || "/check/start"; // default destination

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-4 py-10">
      <section className="mx-auto w-full max-w-[560px] text-center">
        <h1 className="text-[22px] md:text-[28px] font-semibold text-[#0F172A]">
          Enter Password
        </h1>
        <GateForm nextUrl={nextUrl} />  {/* <-- pass it down */}
      </section>
    </main>
  );
}
