import Image from "next/image";
import HeaderStart from "@/components/HeaderStart";

export const metadata = { title: "Curebbear — Private Beta" };

export default function Home() {
  return (
    <>
    <main className="min-h-screen bg-[#F5F7FA] px-4 py-10 md:py-14">
      <section className="mx-auto w-full max-w-[940px] text-center">
        {/* Hero image */}
        <div className="mx-auto w-full overflow-hidden rounded-[18px] bg-gray-100">
          <div className="relative aspect-[928/619] w-full md:aspect-[16/8]">
            <Image
              src="/curebbean.png"
              alt="Trusted Health Guidance for the Caribbean"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Headings */}
        <h1 className="mt-8 text-[22px] leading-[30px] font-bold text-[#0F172A] md:mt-10 md:text-[28px] md:leading-[36px]">
          Trusted Health Guidance for the Caribbean
        </h1>
        <div className="mt-2 text-[20px] leading-[28px] text-[#DD5124] md:text-[24px] md:leading-[32px]">
          Coming Soon – Private Beta
        </div>

        {/* Disclaimer */}
        <p className="mx-auto mt-6 max-w-[820px] text-center text-[13px] leading-[20px] text-[#4A739C]">
          Disclaimer: This app is for informational purposes only and does not provide medical advice.
          Always consult a healthcare professional for diagnosis and treatment.
        </p>
      </section>
    </main>
    </>
  );
}
