export interface Rim {
  id: string;
  name: string;
  style: string;
  color: string;
  image: string; // Rim image
  description: string;
}

export const rims: Rim[] = [
  {
    id: 'rim-1',
    name: 'Chrome Multi-Spoke',
    style: 'Classic',
    color: 'Chrome Silver',
    image: '/images/4163b269-8817-4864-ad5c-b4c010ffb273.jpg',
    description: 'Classic chrome multi-spoke design with polished finish',
  },
  {
    id: 'rim-2',
    name: 'Black Sport Mesh',
    style: 'Sport',
    color: 'Matte Black',
    image: '/images/becf64e6-b32e-42cc-9da0-2e0630357ff7.jpg',
    description: 'Aggressive black mesh sport design with deep concave',
  },
  {
    id: 'rim-3',
    name: 'Silver Split-Spoke',
    style: 'Luxury',
    color: 'Silver',
    image: '/images/cfd7cdae-e500-4e73-b81f-fbe791e235b8.jpg',
    description: 'Premium silver split-spoke design with modern styling',
  },
  {
    id: 'rim-4',
    name: 'Gunmetal Racing',
    style: 'Racing',
    color: 'Gunmetal Gray',
    image: '/images/f612cd15-1bfc-4c54-b41c-059ab0070079.jpg',
    description: 'High-performance gunmetal racing wheels with bold design',
  },
];

export const getRimById = (id: string): Rim | undefined => {
  return rims.find((rim) => rim.id === id);
};

