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
    <section id="contact-us" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-viga text-3xl md:text-4xl text-black mb-2">
          {contactBaseInfo.title}
        </h2>
        <p className="text-lg text-black text-3xl mb-12">
          {contactBaseInfo.subtitle}
        </p>
        <div className="text-lg text-black mb-12">
          <div className="flex flex-wrap justify-center gap-8">
            {contacts.map((contact, idx) => (
              <span key={idx} className="flex items-center">
                <Image
                  src={contact.icon}
                  alt={contact.alt}
                  width={24}
                  height={24}
                  className="inline-block align-middle mr-2"
                />
                {contact.link ? (
                  <a
                    href={contact.link}
                    target={
                      contact.link.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      contact.link.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="hover:text-blue-600 transition-colors"
                  >
                    {contact.text}
                  </a>
                ) : (
                  contact.text
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
