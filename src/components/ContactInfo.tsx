"use client";

import Image from "next/image";

interface ContactInfo {
  icon: string;
  alt: string;
  text: string;
  link?: string;
}

interface ContactInfoProps {
  contacts: ContactInfo[];
}

interface ContactBaseInfo {
  title: string;
  subtitle: string;
}

interface ContactInfoProps {
  contacts: ContactInfo[];
  contactBaseInfo: ContactBaseInfo;
}

export default function ContactInfo({
  contacts,
  contactBaseInfo,
}: ContactInfoProps) {
  return (
    <section id="contact-us" className="py-12 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-viga text-2xl sm:text-3xl md:text-4xl text-black mb-2">
          {contactBaseInfo.title}
        </h2>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black mb-8 sm:mb-12 px-4">
          {contactBaseInfo.subtitle}
        </p>
        <div className="text-base sm:text-lg text-black mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8">
            {contacts.map((contact, idx) => {
              const formattedLink =
                contact.alt == "WhatsApp" && contact.link
                  ? `https://wa.me/${contact.link.replace(/\D/g, "")}`
                  : contact.link;

              return (
                <span key={idx} className="flex items-center justify-center">
                  <Image
                    src={contact.icon}
                    alt={contact.alt}
                    width={24}
                    height={24}
                    className="inline-block align-middle mr-2"
                  />
                  {formattedLink ? (
                    <a
                      href={formattedLink}
                      target="_blank"
                      rel={
                        formattedLink.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="hover:text-blue-600 transition-colors break-all sm:break-normal"
                    >
                      {contact.text}
                    </a>
                  ) : (
                    <span className="break-all sm:break-normal">
                      {contact.text}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
