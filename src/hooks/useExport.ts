import { useState } from 'react'
import * as XLSX from 'xlsx'

export type ExportFormat = 'excel' | 'csv' | 'pdf'

interface ExportOptions {
  fileName: string
  format: ExportFormat
  includeHeaders?: boolean
}

interface SheetData {
  name: string
  data: any[]
  columns?: string[]
}

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false)

  const exportToExcel = async (sheets: SheetData[], options: ExportOptions) => {
    const workbook = XLSX.utils.book_new()

    sheets.forEach((sheet) => {
      const worksheet = XLSX.utils.json_to_sheet(sheet.data)
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name)
    })

    const fileName = `${options.fileName}_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(workbook, fileName)
  }

  const exportToCSV = async (sheets: SheetData[], options: ExportOptions) => {
    if (sheets.length === 1) {
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(sheets[0].data)
      XLSX.utils.book_append_sheet(workbook, worksheet, sheets[0].name)
      const fileName = `${options.fileName}_${new Date().toISOString().split('T')[0]}.csv`
      XLSX.writeFile(workbook, fileName, { bookType: 'csv' })
    } else {
      sheets.forEach((sheet) => {
        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(sheet.data)
        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name)
        const fileName = `${options.fileName}_${sheet.name}_${new Date().toISOString().split('T')[0]}.csv`
        XLSX.writeFile(workbook, fileName, { bookType: 'csv' })
      })
    }
  }

  const exportToPDF = async (sheets: SheetData[], options: ExportOptions) => {
    const createTableHTML = (title: string, tableData: any[]) => {
      if (tableData.length === 0) return ''

      const headers = Object.keys(tableData[0])
      const rows = tableData.map((row) =>
        headers.map((header) => row[header] || '')
      )

      return `
        <div style="page-break-after: always;">
          <h2>${title}</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                ${headers.map((h) => `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows
                .map(
                  (row) => `
                <tr>
                  ${row.map((cell) => `<td style="border: 1px solid #ddd; padding: 8px;">${cell}</td>`).join('')}
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `
    }

    let html = `
      <html>
        <head>
          <title>${options.fileName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            table { font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>${options.fileName} - ${new Date().toLocaleDateString()}</h1>
    `

    sheets.forEach((sheet) => {
      html += createTableHTML(sheet.name, sheet.data)
    })

    html += `
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }

  const handleExport = async (sheets: SheetData[], options: ExportOptions) => {
    setIsExporting(true)
    try {
      switch (options.format) {
        case 'excel':
          await exportToExcel(sheets, options)
          break
        case 'csv':
          await exportToCSV(sheets, options)
          break
        case 'pdf':
          await exportToPDF(sheets, options)
          break
      }
    } catch (error) {
      console.error('Export failed:', error)
      throw error
    } finally {
      setIsExporting(false)
    }
  }

  return {
    handleExport,
    isExporting,
  }
}
