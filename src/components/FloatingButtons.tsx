import Image from "next/image";

interface FloatingButtonsProps {
  email: string;
  whatsapp: string;
}

export default function FloatingButtons({
  email,
  whatsapp,
}: FloatingButtonsProps) {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col items-end space-y-2 sm:space-y-3 z-50">
      <a
        href={`mailto:${email}`}
        className="transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
        title="Send Email"
      >
        <Image
          src="/email-floating-icon.png"
          alt="Email"
          width={48}
          height={48}
          className="w-10 h-10 sm:w-12 sm:h-12"
        />
      </a>
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="bg-gray-800/60 text-yellow-400 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full shadow-lg border border-gray-400/50 whitespace-nowrap backdrop-blur-sm">
          按此聯絡康師父
        </span>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
          title="Chat on WhatsApp"
        >
          <Image
            src="/wa-floating-icon.png"
            alt="WhatsApp"
            width={48}
            height={48}
            className="w-10 h-10 sm:w-12 sm:h-12"
          />
        </a>
      </div>
    </div>
  );
}
