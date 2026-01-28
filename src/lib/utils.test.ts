import {
  getImageSrc,
  getImageAlt,
  createContactInfo,
  getApiContent,
} from "@/lib/utils";

describe("Utils", () => {
  describe("getImageSrc", () => {
    it("should return string as is", () => {
      const src = "https://example.com/image.jpg";
      expect(getImageSrc(src)).toBe(src);
    });

    it("should extract src from object", () => {
      const item = { src: "https://example.com/image.jpg" };
      expect(getImageSrc(item)).toBe("https://example.com/image.jpg");
    });

    it("should extract url from object if src is missing", () => {
      const item = { url: "https://example.com/image.jpg" };
      expect(getImageSrc(item)).toBe("https://example.com/image.jpg");
    });

    it("should return empty string if invalid object", () => {
      expect(getImageSrc({})).toBe("");
    });
  });

  describe("getImageAlt", () => {
    it("should return fallback if input is string", () => {
      expect(getImageAlt("image.jpg", "fallback")).toBe("fallback");
    });

    it("should return alt from object", () => {
      expect(getImageAlt({ alt: "Alt text" }, "fallback")).toBe("Alt text");
    });

    it("should return fallback if alt is missing in object", () => {
      expect(getImageAlt({}, "fallback")).toBe("fallback");
    });
  });

  describe("getApiContent", () => {
    it("should return null if response is not success", () => {
      expect(getApiContent({ success: false })).toBeNull();
    });

    it("should return data from ApiResponse", () => {
      const data = { foo: "bar" };
      expect(getApiContent({ success: true, data })).toEqual(data);
    });

    it("should return content from ApiResponse", () => {
      const content = { foo: "bar" };
      expect(getApiContent({ success: true, content })).toEqual(content);
    });
  });

  describe("createContactInfo", () => {
    const translations = {
      whatsapp: "WhatsApp",
      phone: "Phone",
      email: "Email",
      facebook: "Facebook",
    };

    it("should use provided content", () => {
      const content = {
        whatsapp: "12345678",
        phone: "87654321",
        email: "test@example.com",
        facebook: "fb-link",
      };
      const result = createContactInfo(content, translations);

      expect(result).toHaveLength(4);
      expect(result.find((i) => i.alt === "WhatsApp")?.text).toBe("12345678");
      expect(result.find((i) => i.alt === "Phone")?.text).toBe("87654321");
      expect(result.find((i) => i.alt === "Email")?.text).toBe(
        "test@example.com",
      );
      expect(result.find((i) => i.alt === "Facebook")?.text).toBe("fb-link");
    });

    it("should use default values if content is undefined", () => {
      const result = createContactInfo(undefined, translations);
      expect(result).toHaveLength(4);
      expect(result.find((i) => i.alt === "WhatsApp")?.text).toContain(
        "6806-0108",
      );
    });
  });
});
