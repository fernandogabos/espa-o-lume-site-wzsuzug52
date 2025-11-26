import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import * as Icons from 'lucide-react'
import { IconName } from '@/types/content'

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

const availableIcons: IconName[] = [
  'Wifi',
  'CalendarCheck',
  'Users',
  'Key',
  'Shield',
  'MapPin',
  'Heart',
  'Zap',
  'Droplets',
  'Building2',
  'ShieldCheck',
  'Coffee',
  'Wind',
  'Hammer',
  'Calendar',
  'Camera',
  'ShieldAlert',
  'FileCheck',
  'Accessibility',
  'Palette',
  'Bus',
  'Building',
  'GraduationCap',
]

export function IconPicker({
  value,
  onChange,
  label = 'Ícone',
}: IconPickerProps) {
  const SelectedIcon = (Icons as any)[value] || Icons.HelpCircle

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <SelectedIcon className="w-4 h-4" />
            <SelectValue placeholder="Selecione um ícone" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {availableIcons.map((iconName) => {
            const Icon = (Icons as any)[iconName]
            return (
              <SelectItem key={iconName} value={iconName}>
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{iconName}</span>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
