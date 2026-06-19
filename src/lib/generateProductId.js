/**
 * Generates a unique product ID in the format PRD######
 * (e.g. PRD482910). Retries until a non-duplicate is found.
 *
 * @param {string[]} existingIds - Array of already-used product IDs
 * @returns {string} A unique product ID
 */
export const generateProductId = (existingIds = []) => {
  const existingSet = new Set(existingIds);
  let id;
  let attempts = 0;
  do {
    // 6-digit random number padded to always be 6 digits (100000–999999)
    const digits = Math.floor(100000 + Math.random() * 900000);
    id = `PRD${digits}`;
    attempts++;
    if (attempts > 1000) {
      // Extremely unlikely but prevents an infinite loop
      throw new Error('Could not generate a unique product ID after 1000 attempts');
    }
  } while (existingSet.has(id));

  return id;
};
