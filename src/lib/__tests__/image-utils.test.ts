import { getImageSrc, getImageAlt } from "@/lib/utils";

describe("Image Utility Functions", () => {
  describe("getImageSrc", () => {
    it("should return string as-is when input is string", () => {
      const src = "https://example.com/image.jpg";
      expect(getImageSrc(src)).toBe(src);
    });

    it("should extract src from object with src property", () => {
      const item = { src: "https://example.com/image.jpg" };
      expect(getImageSrc(item)).toBe("https://example.com/image.jpg");
    });

    it("should extract url from object with url property when src is missing", () => {
      const item = { url: "https://example.com/image.jpg" };
      expect(getImageSrc(item)).toBe("https://example.com/image.jpg");
    });

    it("should prefer src over url when both are present", () => {
      const item = {
        src: "https://example.com/from-src.jpg",
        url: "https://example.com/from-url.jpg",
      };
      expect(getImageSrc(item)).toBe("https://example.com/from-src.jpg");
    });

    it("should return empty string for empty object", () => {
      expect(getImageSrc({})).toBe("");
    });

    it("should return empty string for object without src or url", () => {
      const item = { alt: "test", type: "image" };
      expect(getImageSrc(item)).toBe("");
    });

    it("should handle object with empty src", () => {
      const item = { src: "" };
      expect(getImageSrc(item)).toBe("");
    });
  });

  describe("getImageAlt", () => {
    const fallback = "Default Alt Text";

    it("should return fallback when input is string", () => {
      expect(getImageAlt("image.jpg", fallback)).toBe(fallback);
    });

    it("should return alt from object when present", () => {
      const item = { alt: "Custom Alt Text" };
      expect(getImageAlt(item, fallback)).toBe("Custom Alt Text");
    });

    it("should return fallback when alt is missing in object", () => {
      expect(getImageAlt({}, fallback)).toBe(fallback);
    });

    it("should return fallback when alt is empty string", () => {
      const item = { alt: "" };
      expect(getImageAlt(item, fallback)).toBe(fallback);
    });

    it("should handle object with src but no alt", () => {
      const item = { src: "image.jpg" };
      expect(getImageAlt(item, fallback)).toBe(fallback);
    });

    it("should handle object with other properties", () => {
      const item = { src: "test.jpg", type: "image", width: 100 };
      expect(getImageAlt(item, fallback)).toBe(fallback);
    });
  });
});
