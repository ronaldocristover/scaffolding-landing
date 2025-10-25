// Mock data for Master Hong Scaffolding Works API

// Contact Info
export const mockContactInfo = {
  title: "Contact us",
  subtitle: "聯絡我們",
  content: {
    whatsapp: "+852 6806-0108",
    phone: "+852 3020-6719",
    email: "leego.scaffolding@gmail.com",
    facebook: "https://www.facebook.com/MasterHongScaffolding/",
  },
};

// Website Content
export const mockContent = {
  hero: {
    title: "Professional Scaffolding Services",
    subtitle: "20+ Years of Experience in Hong Kong",
    ctaText: "Get Free Quote",
    backgroundImage: "/hero-bg.jpg",
  },
  about: {
    title: "About Master Hong Scaffolding",
    description:
      "Professional scaffolding services with over 20 years of experience serving Hong Kong's construction industry. We provide safe, reliable, and efficient scaffolding solutions for residential, commercial, and industrial projects.",
    stats: [
      {
        label: "Years Experience",
        value: "20+",
      },
      {
        label: "Projects Completed",
        value: "500+",
      },
      {
        label: "Happy Clients",
        value: "300+",
      },
    ],
  },
  services: [
    {
      id: "residential",
      title: "Residential Scaffolding",
      description: "Safe scaffolding for homes and apartments",
      icon: "/icons/residential.svg",
      features: ["Safety Certified", "Quick Setup", "Affordable"],
    },
    {
      id: "commercial",
      title: "Commercial Scaffolding",
      description: "Heavy-duty scaffolding for commercial buildings",
      icon: "/icons/commercial.svg",
      features: ["High Load Capacity", "Custom Solutions", "Fast Assembly"],
    },
    {
      id: "industrial",
      title: "Industrial Scaffolding",
      description: "Specialized scaffolding for industrial facilities",
      icon: "/icons/industrial.svg",
      features: ["Industrial Grade", "Complex Structures", "Safety Focused"],
    },
  ],
};

// Carousel Items
export const mockCarouselItems = [
  {
    id: "carousel_1",
    type: "image" as const,
    url: "/banner-1.jpeg",
    alt: "Scaffolding project 1",
    title: "Commercial Project in Central",
    order: 1,
    active: true,
  },
  {
    id: "carousel_2",
    type: "image" as const,
    url: "/banner-2.jpeg",
    alt: "Scaffolding project 2",
    title: "Residential Building in Tsim Sha Tsui",
    order: 2,
    active: true,
  },
];

// Portfolio Projects
export const mockPortfolioProjects = {
  projects: [
    {
      id: "project_001",
      title: "Residential Building in Mong Kok",
      category: "residential",
      location: "Mong Kok, Kowloon",
      completionDate: "2024-12-15",
      duration: "14 days",
      height: "20 meters",
      description:
        "Complete scaffolding solution for 10-story residential building renovation project",
      images: ["/projects/project_001_1.jpg", "/projects/project_001_2.jpg"],
      challenges: ["Limited space access", "Working above busy street"],
      client: "Private Property Owner",
    },
    {
      id: "project_002",
      title: "Commercial Tower in Central",
      category: "commercial",
      location: "Central, Hong Kong Island",
      completionDate: "2024-11-30",
      duration: "21 days",
      height: "45 meters",
      description:
        "Comprehensive scaffolding system for commercial tower facade renovation",
      images: ["/projects/project_002_1.jpg"],
      challenges: ["High wind exposure", "Pedestrian safety requirements"],
      client: "ABC Development Ltd",
    },
  ],
  categories: [
    { id: "residential", name: "Residential", count: 45 },
    { id: "commercial", name: "Commercial", count: 32 },
    { id: "industrial", name: "Industrial", count: 18 },
  ],
};

// Services Catalog
export const mockServices = {
  services: [
    {
      id: "residential_scaffolding",
      name: "Residential Scaffolding",
      description: "Safe and reliable scaffolding for residential properties",
      basePrice: 150,
      unit: "per square meter",
      minCharge: 3000,
      features: [
        "Safety certified equipment",
        "Professional installation",
        "Regular safety inspections",
        "Insurance coverage",
      ],
      suitableFor: [
        "Apartment buildings",
        "Townhouses",
        "Villas",
        "Renovation projects",
      ],
      timeline: "1-3 days setup",
    },
    {
      id: "commercial_scaffolding",
      name: "Commercial Scaffolding",
      description: "Heavy-duty scaffolding for commercial construction",
      basePrice: 200,
      unit: "per square meter",
      minCharge: 5000,
      features: [
        "Heavy load capacity",
        "Custom design solutions",
        "Certified engineers",
        "24/7 support",
      ],
      suitableFor: [
        "Office buildings",
        "Shopping malls",
        "Hotels",
        "Mixed-use developments",
      ],
      timeline: "3-5 days setup",
    },
  ],
};

// Testimonials
export const mockTestimonials = {
  testimonials: [
    {
      id: "testimonial_001",
      customerName: "Mr. Chan",
      company: "Chan Construction",
      projectType: "commercial",
      rating: 5,
      comment:
        "Professional team, completed on time, very satisfied with the service.",
      projectDate: "2024-11-20",
      verified: true,
      response: {
        message: "Thank you for your feedback! We appreciate your business.",
        from: "Master Hong Team",
        date: "2024-11-21",
      },
    },
    {
      id: "testimonial_002",
      customerName: "Ms. Wong",
      company: "Sunshine Properties",
      projectType: "residential",
      rating: 5,
      comment:
        "Excellent service, very professional and safety-conscious team.",
      projectDate: "2024-10-15",
      verified: true,
      response: {
        message: "Thank you for trusting us with your project!",
        from: "Master Hong Team",
        date: "2024-10-16",
      },
    },
  ],
  statistics: {
    averageRating: 4.8,
    totalReviews: 127,
    recommendationRate: 96,
  },
};

// Admin inquiries
export const mockInquiries = {
  inquiries: [
    {
      id: "inquiry_001",
      type: "quote_request",
      customerName: "John Doe",
      company: "ABC Construction",
      email: "john@example.com",
      phone: "+852 12345678",
      status: "new",
      priority: "normal",
      assignedTo: null,
      createdAt: "2025-01-22T14:30:00Z",
      lastUpdated: "2025-01-22T14:30:00Z",
      projectDetails: {
        location: "Kowloon",
        projectType: "commercial",
        estimatedSize: "medium",
      },
    },
  ],
  summary: {
    total: 45,
    new: 12,
    in_progress: 23,
    completed: 8,
    cancelled: 2,
  },
};
