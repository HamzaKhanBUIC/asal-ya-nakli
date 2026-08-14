// Product Name & Registration Normalization Helpers

export function normalizeProductName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '') // remove non-alphanumeric
    .replace(/\s+/g, '');
}

export function normalizeRegistrationNumber(regNo: string): string {
  if (!regNo) return '';
  return regNo
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9]/g, '');
}

export function normalizeBatchNumber(batchNo: string): string {
  if (!batchNo) return '';
  return batchNo
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9]/g, '');
}

export function calculateTextSimilarity(str1: string, str2: string): number {
  const norm1 = normalizeProductName(str1);
  const norm2 = normalizeProductName(str2);

  if (!norm1 || !norm2) return 0;
  if (norm1 === norm2) return 1.0;
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.85;

  // Simple Levenshtein distance based similarity
  const len1 = norm1.length;
  const len2 = norm2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = norm1[i - 1] === norm2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return Math.max(0, 1 - distance / maxLen);
}
