export interface Location {
  name: string
  code: string
  children?: Location[]
}

export const locationData: Location[] = [
  {
    name: 'Indonesia',
    code: 'ID',
    children: [
      {
        name: 'DKI Jakarta',
        code: 'JK',
        children: [
          { name: 'Jakarta Pusat', code: 'JP' },
          { name: 'Jakarta Utara', code: 'JU' },
          { name: 'Jakarta Barat', code: 'JB' },
          { name: 'Jakarta Selatan', code: 'JS' },
          { name: 'Jakarta Timur', code: 'JT' },
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
    ],
  },
  {
    name: 'Singapore',
    code: 'SG',
    children: [
      {
        name: 'Singapore',
        code: 'SG',
        children: [{ name: 'Singapore', code: 'SG' }],
      },
    ],
  },
  {
    name: 'Malaysia',
    code: 'MY',
    children: [
      {
        name: 'Kuala Lumpur',
        code: 'KL',
        children: [{ name: 'Kuala Lumpur', code: 'KL' }],
      },
      {
        name: 'Selangor',
        code: 'SEL',
        children: [
          { name: 'Petaling Jaya', code: 'PJ' },
          { name: 'Shah Alam', code: 'SA' },
          { name: 'Subang Jaya', code: 'SJ' },
        ],
      },
    ],
  },
]

export function getRegionsByCountry(countryCode: string): Location[] {
  const country = locationData.find((c) => c.code === countryCode)
  return country?.children || []
}

export function getCitiesByRegion(countryCode: string, regionCode: string): Location[] {
  const country = locationData.find((c) => c.code === countryCode)
  const region = country?.children?.find((r) => r.code === regionCode)
  return region?.children || []
}
