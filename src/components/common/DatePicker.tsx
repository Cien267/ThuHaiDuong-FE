import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  disableFutureDates?: boolean
  disablePastDates?: boolean
  className?: string
}

export const DatePicker = ({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  disableFutureDates = false,
  disablePastDates = false,
  className,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [month, setMonth] = useState<Date>(value || new Date())

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined)
      setIsOpen(false)
      return
    }

    setMonth(date)
    const normalizedDate = new Date(date)
    normalizedDate.setHours(12, 0, 0, 0)
    onChange(normalizedDate)
    setIsOpen(false)
  }

  const getDisabledDates = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (disableFutureDates && date > today) return true
    if (disablePastDates && date < today) return true
    return false
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          {value && !isNaN(value.getTime()) ? (
            format(value, 'PPP')
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={value}
          month={month}
          onMonthChange={setMonth}
          onSelect={handleSelect}
          disabled={getDisabledDates}
          fromYear={1900}
          toYear={3000}
        />
      </PopoverContent>
    </Popover>
  )
}
