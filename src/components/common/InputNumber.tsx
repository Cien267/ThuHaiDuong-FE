import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface InputNumberProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'type'
> {
  value?: string | number | null
  onChange?: (value: string | number | null) => void
  allowNegative?: boolean
  allowDecimal?: boolean
  maxDecimals?: number
  returnString?: boolean
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      className,
      value,
      onChange,
      allowNegative = true,
      allowDecimal = true,
      maxDecimals = 2,
      returnString = false,
      onBlur,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value

      if (val === '') {
        onChange?.(null)
        return
      }

      if (!allowNegative && val.startsWith('-')) {
        return
      }

      if (!allowDecimal && val.includes('.')) {
        val = val.replace('.', '')
      }

      if (allowDecimal && val.includes('.')) {
        const [integer, decimal] = val.split('.')
        if (decimal && decimal.length > maxDecimals) {
          val = `${integer}.${decimal.slice(0, maxDecimals)}`
        }
      }

      if (returnString) {
        onChange?.(val)
      } else {
        onChange?.(val as any)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!returnString && value !== null && value !== '') {
        const val = String(value)
        const numValue = allowDecimal ? parseFloat(val) : parseInt(val, 10)
        if (!isNaN(numValue)) {
          onChange?.(numValue)
        }
      }
      onBlur?.(e)
    }

    return (
      <Input
        type="text"
        inputMode="decimal"
        ref={ref}
        className={cn(className)}
        value={value ?? ''}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (
            e.key === 'Backspace' ||
            e.key === 'Delete' ||
            e.key === 'Tab' ||
            e.key === 'Escape' ||
            e.key === 'Enter' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === 'Home' ||
            e.key === 'End'
          ) {
            return
          }

          if (
            allowNegative &&
            e.key === '-' &&
            e.currentTarget.selectionStart === 0
          ) {
            return
          }

          if (allowDecimal && e.key === '.' && !String(value).includes('.')) {
            return
          }

          if (!/^\d$/.test(e.key)) {
            e.preventDefault()
          }
        }}
        {...props}
      />
    )
  }
)

InputNumber.displayName = 'InputNumber'

export { InputNumber }
