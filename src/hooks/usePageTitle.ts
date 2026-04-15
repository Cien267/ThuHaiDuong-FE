import { useEffect } from 'react'

export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | Thu Hải Đường`
    return () => {
      document.title = 'Thu Hải Đường'
    }
  }, [title])
}
