import { QuotePricingInfo } from "@/services/quote-price-service";

type Props = {
  quotePricing: QuotePricingInfo;
};

export default function PricingSection({ quotePricing }: Props) {
  return (
    <section id="pricing" className="py-12 sm:py-20 bg-[#C0FF4B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-viga text-2xl sm:text-[30px] text-black mb-4">
            {quotePricing.title || ""}
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black mb-4 px-4">
            {quotePricing.subtitle || ""}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {quotePricing.content.map((item, idx) => (
            <div key={idx} className="p-4 sm:p-8">
              <h3 className="font-viga text-xl sm:text-2xl mb-4 text-black text-center">
                {item["title"] as string}
              </h3>
              <div className="space-y-3 text-black">
                <p className="text-sm sm:text-base text-black">
                  {item["content"] as string}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
