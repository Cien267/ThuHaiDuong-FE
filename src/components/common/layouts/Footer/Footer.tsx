import { Separator } from '@/components/ui/separator'

export const Footer = () => {
  return (
    <footer className="py-2 px-6 border-t bg-background text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Hoa Hải Đường. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <Separator orientation="vertical" className="h-4" />
          <a href="#" className="hover:underline">
            Support
          </a>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-xs bg-muted px-2 py-1 rounded">v1.0.4</span>
        </div>
      </div>
    </footer>
  )
}
