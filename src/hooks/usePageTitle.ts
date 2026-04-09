import { useEffect } from 'react'

export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | Hoa Hải Đường`
    return () => {
      document.title = 'Hoa Hải Đường'
    }
  }, [title])
}
