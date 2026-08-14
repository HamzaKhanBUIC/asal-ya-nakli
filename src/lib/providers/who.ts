// WHO (World Health Organization) Global Medical Product Alerts Provider

import { OfficialAlert } from '@/types';
import { normalizeProductName, normalizeBatchNumber } from '@/lib/normalization';

export const WHO_ALERTS_SEED: OfficialAlert[] = [
  {
    id: 'who-alert-2026-04',
    source: 'WHO Medical Product Alert N°4/2026',
    title: 'Falsified Paracetamol 500mg Tablets detected in South Asia Region',
    productNames: ['Panadol', 'Panadol Extra', 'Paracetamol 500mg', 'Flynn Paracetamol'],
    activeIngredients: ['Paracetamol', 'Acetaminophen'],
    batchNumbers: ['B8921', 'B892', 'PK9901', 'BN4092'],
    manufacturers: ['Unregistered Generic Pharma', 'Fake GSK Replica Ltd'],
    countries: ['Pakistan', 'Afghanistan'],
    alertDate: '2026-02-10',
    severity: 'HIGH',
    sourceUrl: 'https://www.who.int/news/item/medical-product-alert-2026-04',
    summary:
      'WHO has identified confirmed falsified batches of 500mg Paracetamol tablets with missing active ingredients and substandard foil seals.',
  },
  {
    id: 'who-alert-2025-09',
    source: 'WHO Medical Product Alert N°9/2025',
    title: 'Substandard and Falsified Amoxicillin/Clavulanate Formulations',
    productNames: ['Augmentin', 'Augmentin 625mg', 'Amox-Clav'],
    activeIngredients: ['Amoxicillin', 'Clavulanic Acid'],
    batchNumbers: ['AUG772', 'AUG773'],
    manufacturers: ['Unauthorized Asian Export Co'],
    countries: ['Pakistan', 'India', 'UAE'],
    alertDate: '2025-11-18',
    severity: 'CRITICAL',
    sourceUrl: 'https://www.who.int/news/item/medical-product-alert-2025-09',
    summary:
      'Counterfeit packaging mimicking GSK Augmentin 625mg containing zero active antibiotic material reported in regional retail markets.',
  },
  {
    id: 'drap-alert-2026-01',
    source: 'DRAP Public Medical Safety Alert N°01/2026',
    title: 'DRAP Warning on Counterfeit Cold & Flu Formulations',
    productNames: ['Arinac', 'Arinac Forte', 'Brufen'],
    activeIngredients: ['Ibuprofen', 'Pseudoephedrine'],
    batchNumbers: ['AR709', 'BR551'],
    manufacturers: ['Illicit Packing Facility Punjab'],
    countries: ['Pakistan'],
    alertDate: '2026-01-22',
    severity: 'HIGH',
    sourceUrl: 'https://www.dra.gov.pk/safety-alerts/2026-01',
    summary:
      'Drug Inspectors seized illegal counterfeit stocks of Arinac Forte displaying altered expiration dates and incorrect font kerning.',
  },
];

export async function searchWhoAlerts(
  productName: string,
  batchNumber?: string
): Promise<OfficialAlert[]> {
  const normProduct = normalizeProductName(productName);
  const normBatch = batchNumber ? normalizeBatchNumber(batchNumber) : '';

  if (!normProduct && !normBatch) return [];

  return WHO_ALERTS_SEED.filter((alert) => {
    // Match product name
    const matchName = alert.productNames.some((name) => {
      const normAlertName = normalizeProductName(name);
      return normProduct.includes(normAlertName) || normAlertName.includes(normProduct);
    });

    // Match batch number if provided
    const matchBatch = normBatch
      ? alert.batchNumbers?.some((b) => normalizeBatchNumber(b) === normBatch)
      : false;

    return matchName || matchBatch;
  });
}
