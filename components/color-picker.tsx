'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  label: string
  color: string
  onChange: (color: string) => void
}

export const ColorPicker = memo(function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  const [inputColor, setInputColor] = useState(color)

  useEffect(() => {
    setInputColor(color)
  }, [color])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setInputColor(newColor)
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      onChange(newColor)
    }
  }, [onChange])

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }, [onChange])

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor={label} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Input
        id={`${label}-color`}
        type="color"
        value={color}
        onChange={handleColorChange}
        className="w-10 h-10 p-0 border-none"
      />
      <Input
        id={`${label}-text`}
        type="text"
        value={inputColor}
        onChange={handleInputChange}
        className="w-24 text-sm"
        placeholder="#RRGGBB"
      />
    </div>
  )
})

