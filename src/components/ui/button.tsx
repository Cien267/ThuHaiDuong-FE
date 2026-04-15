import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        sky: 'bg-sky-500 text-white hover:bg-sky-600 shadow-[0_1px_2px_rgba(14,165,233,0.4)] active:scale-95',
        soft: 'bg-primary/10 text-primary hover:bg-primary/20 border-transparent',
        glass:
          'bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 shadow-sm',
        shiny:
          'bg-gradient-to-b from-primary to-primary/80 text-primary-foreground border-b-2 border-primary/50 shadow-inner hover:brightness-110 active:border-b-0 active:translate-y-[1px]',
        brutal:
          'border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
        warn: 'bg-amber-500 text-white hover:bg-amber-600 shadow-[0_1px_2px_rgba(245,158,11,0.4)] active:scale-95',
        green:
          'bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_1px_2px_rgba(16,185,129,0.4)] active:scale-95',
        greenSoft:
          'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-transparent',
        greenShiny:
          'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white border-b-2 border-emerald-500 shadow-inner hover:brightness-110 active:border-b-0 active:translate-y-[1px]',
        greenGlass:
          'bg-emerald-500/10 backdrop-blur-md border border-emerald-400/30 text-emerald-600 hover:bg-emerald-500/20 shadow-sm',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
