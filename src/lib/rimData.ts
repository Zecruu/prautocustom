export interface Rim {
  id: string;
  name: string;
  size: string;
  style: string;
  color: string;
  price: string;
  image: string;
  description: string;
}

export const rims: Rim[] = [
  {
    id: 'rim-1',
    name: 'Classic Chrome',
    size: '18"',
    style: 'Classic',
    color: 'Chrome Silver',
    price: '$450',
    image: '/rims/classic-chrome.png',
    description: 'Timeless chrome finish with classic design',
  },
  {
    id: 'rim-2',
    name: 'Sport Black',
    size: '19"',
    style: 'Sport',
    color: 'Matte Black',
    price: '$520',
    image: '/rims/sport-black.png',
    description: 'Aggressive sport design with matte black finish',
  },
  {
    id: 'rim-3',
    name: 'Luxury Gold',
    size: '20"',
    style: 'Luxury',
    color: 'Gold',
    price: '$680',
    image: '/rims/luxury-gold.png',
    description: 'Premium luxury style with gold accents',
  },
  {
    id: 'rim-4',
    name: 'Racing Red',
    size: '19"',
    style: 'Racing',
    color: 'Candy Red',
    price: '$550',
    image: '/rims/racing-red.png',
    description: 'High-performance racing design in vibrant red',
  },
  {
    id: 'rim-5',
    name: 'Modern White',
    size: '18"',
    style: 'Modern',
    color: 'Pearl White',
    price: '$480',
    image: '/rims/modern-white.png',
    description: 'Contemporary design with pearl white finish',
  },
  {
    id: 'rim-6',
    name: 'Titanium Gray',
    size: '20"',
    style: 'Premium',
    color: 'Titanium Gray',
    price: '$620',
    image: '/rims/titanium-gray.png',
    description: 'Premium titanium gray with brushed finish',
  },
];

export const getRimById = (id: string): Rim | undefined => {
  return rims.find((rim) => rim.id === id);
};

