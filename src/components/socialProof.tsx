import Image from "next/image";

export function SocialProof() {
  return (
    <section className="self-stretch py-16 flex flex-col justify-center items-center gap-6 overflow-hidden">
      <div className="text-center text-gray-300 text-xl font-medium leading-tight">
        Trusted by builders at
      </div>
      <div className="flex gap-8 justify-center flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <Image
            key={i}
            src={`/logos/logo0${i + 1}.svg`}
            alt={`Company Logo ${i + 1}`}
            width={400}
            height={120}
            className="w-full max-w-[200px] h-auto object-contain grayscale opacity-70"
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <Image
            key={i}
            src={`/logos/logo0${i + 5}.svg`}
            alt={`Company Logo ${i + 5}`}
            width={400}
            height={120}
            className="w-full max-w-[200px] h-auto object-contain grayscale opacity-70 brightness-0 invert"
          />
        ))}
      </div>
    </section>
  );
}
