import { Document } from '../types';

export const AVAILABLE_DOCUMENTS: Document[] = [
  {
    id: 'tds-maxterra',
    name: 'TDS - MAXTERRA® MgO Non-Combustible Board',
    description: 'Technical data sheet with product specifications and performance characteristics',
    fileSize: '2 MB',
    fileSizeBytes: 2097152,
    url: '/documents/TDS-MAXTERRA-MgO.pdf',
    category: 'Technical Data Sheet',
  },
  {
    id: 'esr-5194',
    name: 'ESR-5194 - MAXTERRA® MgO',
    description: 'Evaluation service report for building code compliance',
    fileSize: '645 KB',
    fileSizeBytes: 660480,
    url: '/documents/ESR-5194-MAXTERRA-MgO.pdf',
    category: 'Evaluation Report',
  },
  {
    id: 'msds-maxterra',
    name: 'MSDS - MAXTERRA™ MgO',
    description: 'Material safety data sheet with health and safety information',
    fileSize: '293 KB',
    fileSizeBytes: 300032,
    url: '/documents/MSDS-MAXTERRA-MgO.pdf',
    category: 'Safety Data Sheet',
  },
  {
    id: 'leed-credit-guide',
    name: 'LEED Credit Guide',
    description: 'Environmental credit guide for LEED certification',
    fileSize: '510 KB',
    fileSizeBytes: 522240,
    url: '/documents/LEED-Credit-Guide-7-16-25.pdf',
    category: 'LEED Guide',
  },
  {
    id: 'installation-guide',
    name: 'Installation Guide - MAXTERRA',
    description: 'Comprehensive product installation guide with step-by-step instructions',
    fileSize: '3 MB',
    fileSizeBytes: 3145728,
    url: '/documents/Installation-Guide-MAXTERRA.pdf',
    category: 'Installation Guide',
  },
  {
    id: 'limited-warranty',
    name: 'Limited Warranty',
    description: 'Product warranty terms and conditions',
    fileSize: '120 KB',
    fileSizeBytes: 122880,
    url: '/documents/Limited-Warranty-8-31-2023.pdf',
    category: 'Warranty',
  },
  {
    id: 'esl-1645',
    name: 'ESL-1645 Certified Floor/Ceiling',
    description: 'Certification report for floor and ceiling assemblies',
    fileSize: '522 KB',
    fileSizeBytes: 534528,
    url: '/documents/ESL-1645-Certified-FloorCeiling.pdf',
    category: 'Certification',
  },
];

export const PRODUCT_SIZES = [
  '1/2 in (12mm)',
  '5/8 in (16mm)',
  'Custom',
];

export const APP_STEPS = [
  {
    id: 1,
    name: 'Submittal Form',
    description: 'Enter project details',
    path: '/form',
  },
  {
    id: 2,
    name: 'Select Documents',
    description: 'Choose documents to include',
    path: '/select',
  },
  {
    id: 3,
    name: 'Arrange & Generate',
    description: 'Reorder and create packet',
    path: '/arrange',
  },
];
