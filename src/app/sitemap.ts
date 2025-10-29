import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.prautocustoms.com';

  // Get current date for lastModified
  const currentDate = new Date();

  return [
    // Homepage - Highest priority
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // Main customer pages - High priority
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/visualizer`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quote`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Authentication pages - Medium priority
    {
      url: `${baseUrl}/signin`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },

    // Admin signin - Low priority (not for customers)
    {
      url: `${baseUrl}/admin/signin`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.1,
    },
  ];
}

