"use client";

import { useState } from "react";
import ContactService, { ContactFormRequest } from "@/services/contact-service";
import { useTranslations } from "next-intl";

interface ContactFormProps {
  locale?: string;
  className?: string;
}

export default function ContactForm({ locale = "en", className = "" }: ContactFormProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState<ContactFormRequest>({
    name: "",
    company: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    projectType: "residential",
    location: "",
    urgency: "normal",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    // Validate form
    const validation = ContactService.validateContactForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await ContactService.submitContactForm(formData);

      if (response.success) {
        setSubmitStatus({
          type: "success",
          message: locale === "zh"
            ? "感謝您的查詢！我們將在2-4小時內回覆您。"
            : "Thank you for your inquiry! We'll respond within 2-4 hours."
        });
        // Reset form
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          projectType: "residential",
          location: "",
          urgency: "normal",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: response.error?.message || (locale === "zh" ? "提交失敗，請重試。" : "Submission failed, please try again.")
        });
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus({
        type: "error",
        message: locale === "zh" ? "網絡錯誤，請重試。" : "Network error, please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        {locale === "zh" ? "聯繫我們" : "Contact Us"}
      </h3>

      {submitStatus.type && (
        <div
          className={`p-4 rounded-md mb-6 ${
            submitStatus.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {locale === "zh" ? "姓名 *" : "Name *"}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0FF4B] ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              {locale === "zh" ? "公司名稱" : "Company"}
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0FF4B]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {locale === "zh" ? "電子郵件 *" : "Email *"}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0FF4B] ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              {locale === "zh" ? "電話 *" : "Phone *"}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0FF4B] ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
              {locale === "zh" ? "項目類型 *" : "Project Type *"}
            </label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0FF4B] ${
                errors.projectType ? "border-red-500" : "border-gray-300"
              }`}
              required
            >
              <option value="residential">
                {locale === "zh" ? "住宅" : "Residential"}
              </option>
              <option value="commercial">
                {locale === "zh" ? "商業" : "Commercial"}
              </option>
              <option value="industrial">
                {locale === "zh" ? "工業" : "Industrial"}
              </option>
            </select>
            {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType}</p>}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              {locale === "zh" ? "地點 *" : "Location *"}
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0FF4B] ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
              {locale === "zh" ? "緊急程度" : "Urgency"}
            </label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0FF4B]"
            >
              <option value="normal">
                {locale === "zh" ? "正常" : "Normal"}
              </option>
              <option value="urgent">
                {locale === "zh" ? "緊急" : "Urgent"}
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              {locale === "zh" ? "主題" : "Subject"}
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0FF4B]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            {locale === "zh" ? "留言 *" : "Message *"}
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C0FF4B] ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#C0FF4B] text-black font-semibold py-3 px-4 rounded-md hover:bg-[#B0E040] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? locale === "zh" ? "提交中..." : "Submitting..."
            : locale === "zh" ? "提交查詢" : "Submit Inquiry"
          }
        </button>
      </form>
    </div>
  );
}