import Image from "next/image";

interface FloatingButtonsProps {
  email: string;
  whatsapp: string;
}

export default function FloatingButtons({ email, whatsapp }: FloatingButtonsProps) {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
      <a
        href={`mailto:${email}`}
        className="transition-all hover:scale-110 flex items-center justify-center"
        title="Send Email"
      >
        <Image
          src="/email-floating-icon.png"
          alt="Email"
          width={48}
          height={48}
          className="w-12 h-12"
        />
      </a>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-all hover:scale-110 flex items-center justify-center"
        title="Chat on WhatsApp"
      >
        <Image
          src="/wa-floating-icon.png"
          alt="WhatsApp"
          width={48}
          height={48}
          className="w-12 h-12"
        />
      </a>
    </div>
  );
}