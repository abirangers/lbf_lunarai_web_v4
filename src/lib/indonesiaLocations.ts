// Comprehensive Indonesia location data - 34 provinces with major cities
// Data ini bisa di-extend dari database n8n nanti

export interface Location {
  name: string
  code: string
  children?: Location[]
}

export const indonesiaProvinces: Location[] = [
  {
    name: 'Aceh',
    code: 'AC',
    children: [
      { name: 'Banda Aceh', code: 'BNA' },
      { name: 'Langsa', code: 'LGS' },
      { name: 'Lhokseumawe', code: 'LSM' },
      { name: 'Sabang', code: 'SBG' },
      { name: 'Subulussalam', code: 'SBS' },
    ],
  },
  {
    name: 'Sumatera Utara',
    code: 'SU',
    children: [
      { name: 'Medan', code: 'MDN' },
      { name: 'Binjai', code: 'BNJ' },
      { name: 'Pematangsiantar', code: 'PMS' },
      { name: 'Tebing Tinggi', code: 'TBT' },
      { name: 'Tanjungbalai', code: 'TJB' },
      { name: 'Padang Sidempuan', code: 'PSP' },
      { name: 'Sibolga', code: 'SBL' },
      { name: 'Gunungsitoli', code: 'GST' },
    ],
  },
  {
    name: 'Sumatera Barat',
    code: 'SB',
    children: [
      { name: 'Padang', code: 'PDG' },
      { name: 'Bukittinggi', code: 'BKT' },
      { name: 'Payakumbuh', code: 'PYK' },
      { name: 'Solok', code: 'SLK' },
      { name: 'Sawahlunto', code: 'SWL' },
      { name: 'Padang Panjang', code: 'PPJ' },
      { name: 'Pariaman', code: 'PRM' },
    ],
  },
  {
    name: 'Riau',
    code: 'RI',
    children: [
      { name: 'Pekanbaru', code: 'PKU' },
      { name: 'Dumai', code: 'DUM' },
    ],
  },
  {
    name: 'Kepulauan Riau',
    code: 'KR',
    children: [
      { name: 'Batam', code: 'BTM' },
      { name: 'Tanjung Pinang', code: 'TPI' },
    ],
  },
  {
    name: 'Jambi',
    code: 'JA',
    children: [
      { name: 'Jambi', code: 'JMB' },
      { name: 'Sungai Penuh', code: 'SPH' },
    ],
  },
  {
    name: 'Sumatera Selatan',
    code: 'SS',
    children: [
      { name: 'Palembang', code: 'PLM' },
      { name: 'Prabumulih', code: 'PBM' },
      { name: 'Pagar Alam', code: 'PGA' },
      { name: 'Lubuklinggau', code: 'LLG' },
    ],
  },
  {
    name: 'Bangka Belitung',
    code: 'BB',
    children: [
      { name: 'Pangkal Pinang', code: 'PGK' },
    ],
  },
  {
    name: 'Bengkulu',
    code: 'BE',
    children: [
      { name: 'Bengkulu', code: 'BKL' },
    ],
  },
  {
    name: 'Lampung',
    code: 'LA',
    children: [
      { name: 'Bandar Lampung', code: 'BDL' },
      { name: 'Metro', code: 'MET' },
    ],
  },
  {
    name: 'DKI Jakarta',
    code: 'JK',
    children: [
      { name: 'Jakarta Pusat', code: 'JP' },
      { name: 'Jakarta Utara', code: 'JU' },
      { name: 'Jakarta Barat', code: 'JB' },
      { name: 'Jakarta Selatan', code: 'JS' },
      { name: 'Jakarta Timur', code: 'JT' },
      { name: 'Kepulauan Seribu', code: 'KS' },
    ],
  },
  {
    name: 'Banten',
    code: 'BT',
    children: [
      { name: 'Tangerang', code: 'TNG' },
      { name: 'Tangerang Selatan', code: 'TGS' },
      { name: 'Serang', code: 'SRG' },
      { name: 'Cilegon', code: 'CLG' },
    ],
  },
  {
    name: 'Jawa Barat',
    code: 'JB',
    children: [
      { name: 'Bandung', code: 'BDG' },
      { name: 'Bekasi', code: 'BKS' },
      { name: 'Bogor', code: 'BGR' },
      { name: 'Depok', code: 'DPK' },
      { name: 'Cimahi', code: 'CMH' },
      { name: 'Sukabumi', code: 'SKB' },
      { name: 'Tasikmalaya', code: 'TSM' },
      { name: 'Cirebon', code: 'CRB' },
      { name: 'Banjar', code: 'BJR' },
    ],
  },
  {
    name: 'Jawa Tengah',
    code: 'JT',
    children: [
      { name: 'Semarang', code: 'SMG' },
      { name: 'Surakarta', code: 'SKA' },
      { name: 'Magelang', code: 'MGL' },
      { name: 'Salatiga', code: 'SLT' },
      { name: 'Pekalongan', code: 'PKL' },
      { name: 'Tegal', code: 'TGL' },
      { name: 'Surakarta (Solo)', code: 'SLO' },
    ],
  },
  {
    name: 'DI Yogyakarta',
    code: 'YO',
    children: [
      { name: 'Yogyakarta', code: 'YYK' },
    ],
  },
  {
    name: 'Jawa Timur',
    code: 'JI',
    children: [
      { name: 'Surabaya', code: 'SBY' },
      { name: 'Malang', code: 'MLG' },
      { name: 'Kediri', code: 'KDR' },
      { name: 'Mojokerto', code: 'MJK' },
      { name: 'Pasuruan', code: 'PSR' },
      { name: 'Probolinggo', code: 'PBL' },
      { name: 'Blitar', code: 'BLT' },
      { name: 'Madiun', code: 'MDN' },
      { name: 'Batu', code: 'BTU' },
    ],
  },
  {
    name: 'Bali',
    code: 'BA',
    children: [
      { name: 'Denpasar', code: 'DPS' },
      { name: 'Badung', code: 'BDG' },
      { name: 'Gianyar', code: 'GNY' },
      { name: 'Tabanan', code: 'TBN' },
      { name: 'Ubud', code: 'UBD' },
      { name: 'Sanur', code: 'SNR' },
      { name: 'Seminyak', code: 'SMY' },
    ],
  },
  {
    name: 'Nusa Tenggara Barat',
    code: 'NB',
    children: [
      { name: 'Mataram', code: 'MTR' },
      { name: 'Bima', code: 'BMA' },
    ],
  },
  {
    name: 'Nusa Tenggara Timur',
    code: 'NT',
    children: [
      { name: 'Kupang', code: 'KPG' },
    ],
  },
  {
    name: 'Kalimantan Barat',
    code: 'KB',
    children: [
      { name: 'Pontianak', code: 'PTK' },
      { name: 'Singkawang', code: 'SKW' },
    ],
  },
  {
    name: 'Kalimantan Tengah',
    code: 'KT',
    children: [
      { name: 'Palangkaraya', code: 'PKY' },
    ],
  },
  {
    name: 'Kalimantan Selatan',
    code: 'KS',
    children: [
      { name: 'Banjarmasin', code: 'BJM' },
      { name: 'Banjarbaru', code: 'BJB' },
    ],
  },
  {
    name: 'Kalimantan Timur',
    code: 'KI',
    children: [
      { name: 'Samarinda', code: 'SMD' },
      { name: 'Balikpapan', code: 'BPN' },
      { name: 'Bontang', code: 'BTG' },
    ],
  },
  {
    name: 'Kalimantan Utara',
    code: 'KU',
    children: [
      { name: 'Tarakan', code: 'TRK' },
    ],
  },
  {
    name: 'Sulawesi Utara',
    code: 'SA',
    children: [
      { name: 'Manado', code: 'MDO' },
      { name: 'Bitung', code: 'BTN' },
      { name: 'Tomohon', code: 'TMH' },
      { name: 'Kotamobagu', code: 'KMB' },
    ],
  },
  {
    name: 'Sulawesi Tengah',
    code: 'ST',
    children: [
      { name: 'Palu', code: 'PLU' },
    ],
  },
  {
    name: 'Sulawesi Selatan',
    code: 'SN',
    children: [
      { name: 'Makassar', code: 'MKS' },
      { name: 'Parepare', code: 'PRE' },
      { name: 'Palopo', code: 'PLP' },
    ],
  },
  {
    name: 'Sulawesi Tenggara',
    code: 'SG',
    children: [
      { name: 'Kendari', code: 'KDI' },
      { name: 'Baubau', code: 'BAU' },
    ],
  },
  {
    name: 'Gorontalo',
    code: 'GO',
    children: [
      { name: 'Gorontalo', code: 'GTL' },
    ],
  },
  {
    name: 'Sulawesi Barat',
    code: 'SR',
    children: [
      { name: 'Mamuju', code: 'MMJ' },
    ],
  },
  {
    name: 'Maluku',
    code: 'MA',
    children: [
      { name: 'Ambon', code: 'AMB' },
      { name: 'Tual', code: 'TUL' },
    ],
  },
  {
    name: 'Maluku Utara',
    code: 'MU',
    children: [
      { name: 'Ternate', code: 'TTE' },
      { name: 'Tidore', code: 'TDR' },
    ],
  },
  {
    name: 'Papua',
    code: 'PA',
    children: [
      { name: 'Jayapura', code: 'DJJ' },
    ],
  },
  {
    name: 'Papua Barat',
    code: 'PB',
    children: [
      { name: 'Manokwari', code: 'MKW' },
      { name: 'Sorong', code: 'SOQ' },
    ],
  },
]

// Helper function untuk get provinces
export function getIndonesiaProvinces(): Location[] {
  return indonesiaProvinces
}

// Helper function untuk get cities by province
export function getCitiesByProvince(provinceCode: string): Location[] {
  const province = indonesiaProvinces.find((p) => p.code === provinceCode)
  return province?.children || []
}
