import Image from "next/image";
import Link from "next/link";
import flows from "@/data/flows.json";
import HeaderStart from "@/components/HeaderStart";

export const metadata = { title: "Your Symptom Check Result • Curebbear" };

export default function NonUrgent({ searchParams }) {
  const disease = decodeURIComponent(searchParams.d || "");
  const flow = flows.flows.find((f) => f.disease === disease);

  // fallbacks if any field missing
  const advice =
    flow?.nonUrgentAdvice ||
    "Based on your answers, your symptoms are not urgent. Here are some self-care tips: Monitor your condition, consult a healthcare professional if symptoms persist or worsen, consider over-the-counter remedies for symptom relief, stay hydrated, and get plenty of rest.";

  return (
    <>
      <HeaderStart />

      <main className="min-h-screen bg-[#F5F7FA] px-4 py-8 md:py-10">
        <section className="mx-auto w-full max-w-[940px]">
          <h1 className="text-[24px] md:text-[32px] font-bold text-[#0F172A]">
            Your Symptom Check Result
          </h1>

          {/* Card 1: image with overlay text */}
          <div className="p0.5">
            <div className="mt-5 overflow-hidden rounded-[14px]">
              <div className="relative aspect-[96/55] md:aspect-[96/35] w-full">
                <Image
                  src="/bg-ng.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-transparent" />
                <div className="absolute left-5 top-10 max-w-[520px] text-white">
                  <div className="text-[20px] md:text-[22px] font-semibold">
                    Non-Urgent Advice
                  </div>
                  <p className="mt-2 text-[12px] leading-[22px] md:text-[15px] md:leading-[24px] opacity-95">
                    {advice}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: supportive image */}
          <div className="mt-6 overflow-hidden rounded-[14px]">
            <div className="relative aspect-[96/35] w-full">
              <Image src="/bgng2.png" alt="" fill className="object-cover" />
            </div>
          </div>

          {/* Restart button */}
          <div className="mt-6 flex">
            <Link
              href="/check/symptom-checker"
              className="inline-flex h-[44px] w-full max-w-[560px] items-center justify-center rounded-[10px] px-6 text-[15px] font-semibold text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#DD5124]/30"
              style={{ backgroundColor: "#DD5124" }}
            >
              Restart Symptom Checker
            </Link>
          </div>

          {/* disclaimer */}
          <p className="mx-auto mt-6 max-w-[820px] text-center text-[13px] leading-[20px] text-[#4A739C]">
            Disclaimer: This app is for informational purposes only and does not
            provide medical advice. Always consult a healthcare professional for
            diagnosis and treatment.
          </p>
        </section>
      </main>
    </>
  );
}
