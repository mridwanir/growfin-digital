export type TemplateType = 'fnb' | 'service' | 'retail' | 'grooming';

// Dictionaries of keywords for each template archetype
const KEYWORDS = {
  fnb: [
    'cafe', 'resto', 'warung', 'kopi', 'coffee', 'kuliner', 'makan', 'minum', 'bakso', 'soto', 'sate', 'mie'
  ],
  service: [
    'klinik', 'dokter', 'gigi', 'bidan', 'bengkel', 
    'reparasi', 'servis', 'service', 'cuci mobil', 'laundry'
  ],
  grooming: [
    'kecantikan', 'salon', 'spa', 'cukur', 'barber', 'pijat', 'massage', 'terapi'
  ],
  retail: [
    'toko', 'roti', 'baju', 'pakaian', 'sepatu', 'tas', 'supermarket', 'minimarket', 'grosir', 
    'elektronik', 'gadget', 'handphone', 'komputer', 'optik', 'kacamata', 'kosmetik', 'skincare',
    'aprotek', 'obat', 'material', 'bangunan', 'buku', 'alat tulis', 'mainan', 'pet shop'
  ]
};

/**
 * Resolves the given business category string into the closest matching TemplateType.
 * @param category The scraped category string from the database.
 * @returns The resolved TemplateType. Defaults to 'retail'.
 */
export function resolveTemplateType(category: string | undefined | null): TemplateType {
  if (!category) return 'retail'; // Fallback to retail if empty

  const normalizedCategory = category.toLowerCase().trim();

  for (const keyword of KEYWORDS.fnb) {
    if (normalizedCategory.includes(keyword)) return 'fnb';
  }

  for (const keyword of KEYWORDS.service) {
    if (normalizedCategory.includes(keyword)) return 'service';
  }
  
  for (const keyword of KEYWORDS.grooming) {
    if (normalizedCategory.includes(keyword)) return 'grooming';
  }

  for (const keyword of KEYWORDS.retail) {
    if (normalizedCategory.includes(keyword)) return 'retail';
  }

  // If no match is found, fallback to 'retail' as it's the safest generic catalog UI
  return 'retail';
}

/**
 * A helper to dynamically resolve terminology based on a service category.
 * Used inside the 'service' template (ClinicDemoClient) to adapt words.
 */
export function resolveServiceTerminology(category: string | undefined | null) {
  const normalizedCategory = (category || '').toLowerCase();
  
  if (normalizedCategory.includes('bengkel') || normalizedCategory.includes('servis') || normalizedCategory.includes('reparasi')) {
    return {
      staffTitle: 'Mekanik / Teknisi',
      customerTitle: 'Pelanggan',
      serviceLabel: 'Layanan Perbaikan',
      consultationLabel: 'Konsultasi Kendaraan',
      bookingActionLabel: 'Booking Servis',
      staffEmoji: '👨‍🔧'
    };
  }

  if (normalizedCategory.includes('salon') || normalizedCategory.includes('spa') || normalizedCategory.includes('cukur') || normalizedCategory.includes('barber')) {
    return {
      staffTitle: 'Kapster / Terapis',
      customerTitle: 'Pelanggan',
      serviceLabel: 'Layanan Treatment',
      consultationLabel: 'Konsultasi Gaya',
      bookingActionLabel: 'Booking Treatment',
      staffEmoji: '💇‍♀️'
    };
  }

  // Default Medical / Clinic terminology
  return {
    staffTitle: 'Dokter',
    customerTitle: 'Pasien',
    serviceLabel: 'Layanan Medis',
    consultationLabel: 'Konsultasi Dokter',
    bookingActionLabel: 'Booking Jadwal',
    staffEmoji: '👨‍⚕️'
  };
}
