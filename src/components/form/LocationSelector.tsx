'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { locationData, getRegionsByCountry, getCitiesByRegion } from '@/lib/locations'

interface LocationSelectorProps {
  value: {
    country: string
    region: string
    city: string
  }
  onChange: (value: { country: string; region: string; city: string }) => void
}

export function LocationSelector({ value, onChange }: LocationSelectorProps) {
  const [regions, setRegions] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  useEffect(() => {
    if (value.country) {
      const countryRegions = getRegionsByCountry(value.country)
      setRegions(countryRegions)
      if (!countryRegions.find((r) => r.code === value.region)) {
        onChange({ ...value, region: '', city: '' })
      }
    } else {
      setRegions([])
      setCities([])
    }
  }, [value.country])

  useEffect(() => {
    if (value.country && value.region) {
      const regionCities = getCitiesByRegion(value.country, value.region)
      setCities(regionCities)
      if (!regionCities.find((c) => c.code === value.city)) {
        onChange({ ...value, city: '' })
      }
    } else {
      setCities([])
    }
  }, [value.region])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Country *</Label>
        <Select
          value={value.country}
          onValueChange={(country) => onChange({ country, region: '', city: '' })}
        >
          <SelectTrigger className="input-field">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {locationData.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Region / Province *</Label>
        <Select
          value={value.region}
          onValueChange={(region) => onChange({ ...value, region, city: '' })}
          disabled={!value.country}
        >
          <SelectTrigger className="input-field">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.code} value={region.code}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>City *</Label>
        <Select
          value={value.city}
          onValueChange={(city) => onChange({ ...value, city })}
          disabled={!value.region}
        >
          <SelectTrigger className="input-field">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.code} value={city.code}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
