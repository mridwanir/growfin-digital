import type { GeneratedWebsiteData, GenerateInput } from './schema'

import { env } from '@/lib/env'

import { generatedWebsiteSchema } from './schema'

export function buildGeminiPrompt(input: GenerateInput): string {
  const mapsUrl = input.mapsUrl || input.googleMapsUrl || ''

  return `
Kamu adalah sistem AI perancang website katalog bisnis lokal Indonesia yang profesional.
Buatkan struktur data JSON lengkap untuk bisnis berikut:
- Nama Bisnis: ${input.name}
${mapsUrl ? `- Google Maps URL: ${mapsUrl}` : ''}

Struktur JSON yang WAJIB dihasilkan:
{
  "business": {
    "name": "${input.name}",
    "category": "Cafe & Coffee Shop",
    "city": "",
    "address": "Alamat perkiraan atau lengkap",
    "phone": "",
    "googleMapsUrl": "${mapsUrl}",
    "tagline": "Tagline singkat maksimal 8 kata",
    "brandingContent": {
      "heroTitle": "Judul headline utama yang menarik",
      "heroSubtitle": "Deskripsi singkat penawaran produk atau layanan",
      "tagline": "Tagline singkat",
      "usps": [
        { "title": "Kualitas Terjamin", "description": "Menggunakan bahan pilihan berkualitas tinggi" },
        { "title": "Pelayanan Cepat", "description": "Pesanan diproses secara cepat dan higienis" },
        { "title": "Harga Terjangkau", "description": "Nilai terbaik untuk setiap produk" }
      ],
      "faqs": [
        { "question": "Bagaimana cara melakukan pemesanan?", "answer": "Anda dapat memilih produk dan memesan langsung via WhatsApp." },
        { "question": "Metode pembayaran apa saja yang diterima?", "answer": "Kami menerima transfer bank, QRIS, dan pembayaran tunai." }
      ]
    },
    "themeConfig": {
      "themeColor": "#0f766e",
      "layoutId": "retail-theme-urban",
      "fbType": "DINE_IN"
    },
    "operatingHours": {
      "raw": "Senin - Minggu: 09:00 - 21:00",
      "openTime": "09:00",
      "closeTime": "21:00"
    }
  },
  "categories": [
    { "name": "Kategori Utama", "sortOrder": 0 },
    { "name": "Kategori Pendukung", "sortOrder": 1 }
  ],
  "products": [
    {
      "name": "Produk Unggulan",
      "categoryName": "Kategori Utama",
      "description": "Deskripsi produk yang informatif",
      "basePrice": 25000,
      "originalPrice": 30000,
      "stock": 100,
      "sortOrder": 0,
      "variants": [
        {
          "name": "Pilihan",
          "required": false,
          "options": [
            { "label": "Regular", "priceModifier": 0, "sortOrder": 0 },
            { "label": "Extra", "priceModifier": 5000, "sortOrder": 1 }
          ]
        }
      ]
    }
  ]
}

PANDUAN KONTEN:
1. Kembalikan RAW JSON yang valid saja. JANGAN menyertakan markdown \`\`\`json atau karakter pembungkus lain.
2. Tentukan kategori yang paling tepat untuk bisnis ini (misal: Cafe & Coffee Shop, Restaurant, Bakery, Beauty Salon, Barber Shop, Laundry, Supermarket, Fashion, dll).
3. basePrice dan priceModifier WAJIB berupa integer rupiah (contoh: 25000, 5000), BUKAN string "Rp 25.000".
4. Buatkan minimal 2 kategori dan 3-5 produk yang relevan dengan tipe bisnis.
5. Buatkan varian produk terstruktur (misal Ukuran, Suhu, Level Pedas, Varian Rasa, Paket) dengan opsi { label, priceModifier }.
`
}

/**
 * Invokes Google Gemini API to generate structured website draft data.
 */
export async function generateWithGemini(input: GenerateInput): Promise<GeneratedWebsiteData> {
  const apiKey = env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const prompt = buildGeminiPrompt(input)
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

  const response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`Google Gemini API error (${response.status}): ${errorBody}`)
  }

  const result = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string
        }>
      }
    }>
  }

  const candidate = result.candidates?.[0]
  const part = candidate?.content?.parts?.[0]
  const rawText = part?.text
  if (!rawText) {
    throw new Error('Google Gemini returned empty candidate content')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(rawText)
  } catch (err) {
    throw new Error(
      `Failed to parse Gemini JSON output: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  const validated = generatedWebsiteSchema.parse(parsed)
  const mapsUrl = input.mapsUrl || input.googleMapsUrl
  if (mapsUrl) {
    validated.business.googleMapsUrl = mapsUrl
  }

  return validated
}
