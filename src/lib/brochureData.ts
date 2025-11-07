export interface BrochurePage {
  id: number;
  frontImage: string;
  backImage: string;
  title: string;
  description: string;
  category: string;
}

/**
 * Brochure pages showcasing PR Auto Custom's work
 * 
 * To customize:
 * 1. Add your car work images to the /public/images/ folder
 * 2. Update the frontImage and backImage paths below
 * 3. Update titles and descriptions to match your work
 */
export const brochurePages: BrochurePage[] = [
  {
    id: 0,
    frontImage: '/images/4163b269-8817-4864-ad5c-b4c010ffb273.jpg',
    backImage: '/images/becf64e6-b32e-42cc-9da0-2e0630357ff7.jpg',
    title: 'Custom Wheels & Rims',
    description: 'Premium wheel installations and customizations for all vehicle types. From classic chrome to modern black designs.',
    category: 'Wheels',
  },
  {
    id: 1,
    frontImage: '/images/cfd7cdae-e500-4e73-b81f-fbe791e235b8.jpg',
    backImage: '/images/f612cd15-1bfc-4c54-b41c-059ab0070079.jpg',
    title: 'Performance Upgrades',
    description: 'High-performance modifications and tuning. Exhaust systems, suspension upgrades, and engine enhancements.',
    category: 'Performance',
  },
  {
    id: 2,
    frontImage: '/images/4163b269-8817-4864-ad5c-b4c010ffb273.jpg',
    backImage: '/images/becf64e6-b32e-42cc-9da0-2e0630357ff7.jpg',
    title: 'Body & Paint Work',
    description: 'Professional body modifications and custom paint jobs. From subtle accents to full vehicle wraps.',
    category: 'Exterior',
  },
  {
    id: 3,
    frontImage: '/images/cfd7cdae-e500-4e73-b81f-fbe791e235b8.jpg',
    backImage: '/images/f612cd15-1bfc-4c54-b41c-059ab0070079.jpg',
    title: 'Interior Customization',
    description: 'Luxury interior upgrades and detailing. Custom upholstery, audio systems, and complete interior makeovers.',
    category: 'Interior',
  },
  {
    id: 4,
    frontImage: '/images/4163b269-8817-4864-ad5c-b4c010ffb273.jpg',
    backImage: '/images/becf64e6-b32e-42cc-9da0-2e0630357ff7.jpg',
    title: 'Lighting Systems',
    description: 'LED upgrades, custom headlights, and accent lighting. Illuminate your ride with style and safety.',
    category: 'Lighting',
  },
  {
    id: 5,
    frontImage: '/images/cfd7cdae-e500-4e73-b81f-fbe791e235b8.jpg',
    backImage: '/images/f612cd15-1bfc-4c54-b41c-059ab0070079.jpg',
    title: 'Sound Systems',
    description: 'Premium audio installations with subwoofers, amplifiers, and complete sound system overhauls.',
    category: 'Audio',
  },
  {
    id: 6,
    frontImage: '/images/4163b269-8817-4864-ad5c-b4c010ffb273.jpg',
    backImage: '/images/becf64e6-b32e-42cc-9da0-2e0630357ff7.jpg',
    title: 'Complete Builds',
    description: 'Full vehicle transformations from ground up. See our showcase projects and dream builds.',
    category: 'Projects',
  },
  {
    id: 7,
    frontImage: '/images/cfd7cdae-e500-4e73-b81f-fbe791e235b8.jpg',
    backImage: '/images/f612cd15-1bfc-4c54-b41c-059ab0070079.jpg',
    title: 'Get Your Quote',
    description: 'Ready to transform your vehicle? Contact us today for a free consultation and quote.',
    category: 'Contact',
  },
];

export const getBrochurePageById = (id: number): BrochurePage | undefined =>
  brochurePages.find(page => page.id === id);

