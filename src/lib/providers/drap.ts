// DRAP (Drug Regulatory Authority of Pakistan) Official Registry Provider

import { OfficialProduct } from '@/types';
import { normalizeProductName, normalizeRegistrationNumber } from '@/lib/normalization';

// Curated DRAP Public Registry Database for Authentic & Falsified Comparison
export const DRAP_REGISTRY_SEED: OfficialProduct[] = [
  {
    id: 'drap-001',
    registrationNumber: '001234',
    brandName: 'Panadol',
    genericName: 'Paracetamol',
    strength: '500 mg',
    dosageForm: 'Tablet',
    manufacturer: 'GSK Consumer Healthcare Pakistan Limited',
    country: 'Pakistan',
    status: 'ACTIVE',
    issueDate: '2010-04-12',
    expiryDate: '2030-12-31',
    source: 'DRAP (Drug Regulatory Authority of Pakistan)',
    sourceUrl: 'https://www.dra.gov.pk/registrations/001234',
  },
  {
    id: 'drap-002',
    registrationNumber: '001235',
    brandName: 'Panadol Extra',
    genericName: 'Paracetamol + Caffeine',
    strength: '500 mg / 65 mg',
    dosageForm: 'Tablet',
    manufacturer: 'GSK Consumer Healthcare Pakistan Limited',
    country: 'Pakistan',
    status: 'ACTIVE',
    issueDate: '2012-08-19',
    expiryDate: '2030-12-31',
    source: 'DRAP (Drug Regulatory Authority of Pakistan)',
    sourceUrl: 'https://www.dra.gov.pk/registrations/001235',
  },
  {
    id: 'drap-003',
    registrationNumber: '045892',
    brandName: 'Augmentin 625mg',
    genericName: 'Amoxicillin + Clavulanic Acid',
    strength: '500 mg / 125 mg',
    dosageForm: 'Film-Coated Tablet',
    manufacturer: 'GlaxoSmithKline Pakistan Limited',
    country: 'Pakistan',
    status: 'ACTIVE',
    issueDate: '2008-01-15',
    expiryDate: '2029-06-30',
    source: 'DRAP (Drug Regulatory Authority of Pakistan)',
    sourceUrl: 'https://www.dra.gov.pk/registrations/045892',
  },
  {
    id: 'drap-004',
    registrationNumber: '018923',
    brandName: 'Brufen 400mg',
    genericName: 'Ibuprofen',
    strength: '400 mg',
    dosageForm: 'Film-Coated Tablet',
    manufacturer: 'Abbott Laboratories (Pakistan) Limited',
    country: 'Pakistan',
    status: 'ACTIVE',
    issueDate: '2005-11-20',
    expiryDate: '2030-12-31',
    source: 'DRAP (Drug Regulatory Authority of Pakistan)',
    sourceUrl: 'https://www.dra.gov.pk/registrations/018923',
  },
  {
    id: 'drap-005',
    registrationNumber: '002981',
    brandName: 'Disprin 300mg',
    genericName: 'Aspirin (Acetylsalicylic Acid)',
    strength: '300 mg',
    dosageForm: 'Soluble Tablet',
    manufacturer: 'Reckitt Benckiser Pakistan Ltd',
    country: 'Pakistan',
    status: 'ACTIVE',
    issueDate: '1998-03-10',
    expiryDate: '2030-12-31',
    source: 'DRAP (Drug Regulatory Authority of Pakistan)',
    sourceUrl: 'https://www.dra.gov.pk/registrations/002981',
  },
  {
    id: 'drap-006',
    registrationNumber: '034112',
    brandName: 'Arinac Forte',
    genericName: 'Ibuprofen + Pseudoephedrine HCl',
    strength: '400 mg / 60 mg',
    dosageForm: 'Tablet',
    manufacturer: 'Abbott Laboratories (Pakistan) Limited',
    country: 'Pakistan',
    status: 'ACTIVE',
    issueDate: '2014-05-14',
    expiryDate: '2029-12-31',
    source: 'DRAP (Drug Regulatory Authority of Pakistan)',
    sourceUrl: 'https://www.dra.gov.pk/registrations/034112',
  },
  {
    id: 'drap-007',
    registrationNumber: '059910',
    brandName: 'Flynn Paracetamol Suspicious',
    genericName: 'Paracetamol',
    strength: '500 mg',
    dosageForm: 'Tablet',
    manufacturer: 'Unregistered Generic Pharma Ltd',
    country: 'Unknown',
    status: 'SUSPENDED',
    issueDate: '2021-09-01',
    expiryDate: '2024-09-01',
    source: 'DRAP (Drug Regulatory Authority of Pakistan)',
    sourceUrl: 'https://www.dra.gov.pk/alerts/suspended-059910',
  },
];

export async function searchDrapRegistry(query: string): Promise<OfficialProduct[]> {
  const normQuery = normalizeProductName(query);
  const normRegNo = normalizeRegistrationNumber(query);

  if (!normQuery && !normRegNo) return [];

  return DRAP_REGISTRY_SEED.filter((product) => {
    const normBrand = normalizeProductName(product.brandName);
    const normGeneric = normalizeProductName(product.genericName);
    const matchBrand = normBrand.includes(normQuery) || normQuery.includes(normBrand);
    const matchGeneric = normGeneric.includes(normQuery) || normQuery.includes(normGeneric);
    const matchReg = normalizeRegistrationNumber(product.registrationNumber) === normRegNo;
    const matchMfr = normalizeProductName(product.manufacturer).includes(normQuery);

    return matchBrand || matchGeneric || matchReg || matchMfr;
  });
}

export async function getDrapProductByRegNo(regNo: string): Promise<OfficialProduct | null> {
  const normRegNo = normalizeRegistrationNumber(regNo);
  if (!normRegNo) return null;

  const found = DRAP_REGISTRY_SEED.find(
    (p) => normalizeRegistrationNumber(p.registrationNumber) === normRegNo
  );

  return found || null;
}
