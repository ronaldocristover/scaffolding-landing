const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3002;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Mock data for different locales
const mockData = {
  en: {
    locale: "en",
    hero: {
      certificates: [
        {
          src: "/certificate.jpeg",
          alt: "Company Certificate 1"
        },
        {
          src: "/certificate.jpeg",
          alt: "Company Certificate 2"
        }
      ]
    },
    about: {
      title: "About Our Company",
      subtitle: "Professional scaffolding services",
      description: "We are a professional scaffolding company with years of experience in providing safe and reliable scaffolding solutions for construction projects of all sizes.",
      images: [
        {
          src: "/company-1.png",
          alt: "Company Image 1"
        },
        {
          src: "/company-2.png",
          alt: "Company Image 2"
        }
      ]
    },
    companyLogos: [
      "/company-logo-1.png",
      "/company-logo-2.png",
      "/company-logo-3.png",
      "/company-logo-1.png"
    ],
    video: {
      title: "Company Introduction Video",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    pricing: {
      title: "How to Get Quote",
      subtitle: "6 Easy Steps",
      steps: [
        {
          title: "Step 1: Contact",
          content: "Contact us for initial consultation and project discussion"
        },
        {
          title: "Step 2: Inspection",
          content: "Site inspection and measurement by our professional team"
        },
        {
          title: "Step 3: Quote",
          content: "Quote preparation and competitive pricing analysis"
        },
        {
          title: "Step 4: Agreement",
          content: "Agreement and contract signing with clear terms"
        },
        {
          title: "Step 5: Installation",
          content: "Professional scaffolding installation by certified technicians"
        },
        {
          title: "Step 6: Handover",
          content: "Quality check and project handover with safety documentation"
        }
      ]
    },
    contact: {
      phoneNumber: "+852 6806-0108",
      contacts: [
        {
          type: "whatsapp",
          icon: "/whatsapp-icon.png",
          alt: "WhatsApp",
          text: "+852 6806-0108",
          link: "https://wa.me/85268060108"
        },
        {
          type: "phone",
          icon: "/print-icon.png",
          alt: "Phone",
          text: "+852 3020-6719",
          link: "tel:+85230206719"
        },
        {
          type: "email",
          icon: "/email-icon.png",
          alt: "Email",
          text: "leego.scaffolding@gmail.com",
          link: "mailto:leego.scaffolding@gmail.com"
        },
        {
          type: "facebook",
          icon: "/fb-icon.png",
          alt: "Facebook",
          text: "https://www.facebook.com/MasterHongScaffolding/",
          link: "https://www.facebook.com/MasterHongScaffolding/"
        }
      ]
    },
    footer: {
      copyright: "© 2024 Scaffolding Engineering Limited. All rights reserved."
    },
    navigation: {
      about: "About",
      pricing: "Pricing",
      contact: "Contact"
    }
  },
  "zh-HK": {
    locale: "zh-HK",
    hero: {
      certificates: [
        {
          src: "/certificate.jpeg",
          alt: "公司證書 1"
        },
        {
          src: "/certificate.jpeg",
          alt: "公司證書 2"
        }
      ]
    },
    about: {
      title: "關於我們公司",
      subtitle: "專業搭棚服務",
      description: "我們是一家專業的搭棚公司，擁有多年為各種規模建築項目提供安全可靠搭棚解決方案的經驗。",
      images: [
        {
          src: "/company-1.png",
          alt: "公司圖片 1"
        },
        {
          src: "/company-2.png",
          alt: "公司圖片 2"
        }
      ]
    },
    companyLogos: [
      "/company-logo-1.png",
      "/company-logo-2.png",
      "/company-logo-3.png",
      "/company-logo-1.png"
    ],
    video: {
      title: "公司介紹影片",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    pricing: {
      title: "如何獲取報價",
      subtitle: "6個簡單步驟",
      steps: [
        {
          title: "第1步：聯絡",
          content: "聯絡我們進行初步諮詢和項目討論"
        },
        {
          title: "第2步：檢查",
          content: "由我們的專業團隊進行現場檢查和測量"
        },
        {
          title: "第3步：報價",
          content: "準備報價單和競爭性價格分析"
        },
        {
          title: "第4步：協議",
          content: "簽署協議和合同，條款清晰明確"
        },
        {
          title: "第5步：安裝",
          content: "由認證技術人員進行專業搭棚安裝"
        },
        {
          title: "第6步：交付",
          content: "質量檢查和項目交付，並提供安全文件"
        }
      ]
    },
    contact: {
      phoneNumber: "+852 6806-0108",
      contacts: [
        {
          type: "whatsapp",
          icon: "/whatsapp-icon.png",
          alt: "WhatsApp",
          text: "+852 6806-0108",
          link: "https://wa.me/85268060108"
        },
        {
          type: "phone",
          icon: "/print-icon.png",
          alt: "電話",
          text: "+852 3020-6719",
          link: "tel:+85230206719"
        },
        {
          type: "email",
          icon: "/email-icon.png",
          alt: "電郵",
          text: "leego.scaffolding@gmail.com",
          link: "mailto:leego.scaffolding@gmail.com"
        },
        {
          type: "facebook",
          icon: "/fb-icon.png",
          alt: "Facebook",
          text: "https://www.facebook.com/MasterHongScaffolding/",
          link: "https://www.facebook.com/MasterHongScaffolding/"
        }
      ]
    },
    footer: {
      copyright: "© 2024 利高棚業工程有限公司。版權所有。"
    },
    navigation: {
      about: "關於我們",
      pricing: "報價",
      contact: "聯絡我們"
    }
  }
};

// Routes

// Get all landing page data for a specific locale
app.get('/api/landing-page/:locale', (req, res) => {
  const { locale } = req.params;

  if (!mockData[locale]) {
    return res.status(404).json({
      error: "Not Found",
      message: "Locale not supported",
      statusCode: 404
    });
  }

  res.json(mockData[locale]);
});

// Get contact information only
app.get('/api/contact', (req, res) => {
  res.json(mockData.en.contact);
});

// Get pricing steps for a specific locale
app.get('/api/pricing/:locale', (req, res) => {
  const { locale } = req.params;

  if (!mockData[locale]) {
    return res.status(404).json({
      error: "Not Found",
      message: "Locale not supported",
      statusCode: 404
    });
  }

  res.json(mockData[locale].pricing);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "Endpoint not found",
    statusCode: 404
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong",
    statusCode: 500
  });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`  GET /api/landing-page/:locale`);
  console.log(`  GET /api/contact`);
  console.log(`  GET /api/pricing/:locale`);
  console.log(`  GET /api/health`);
});

module.exports = app;