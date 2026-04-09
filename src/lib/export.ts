import * as XLSX from 'xlsx'
import type { ExportSettings, ExportData } from '../types'
import {
  PEOPLE_COLUMNS,
  COMPANY_COLUMNS,
  ASSET_COLUMNS,
  LIABILITY_COLUMNS,
} from '../constants/export'

const formatValue = (value: any): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value instanceof Date) return value.toLocaleDateString()
  if (typeof value === 'object' && 'street' in value) {
    const addr = value as any
    return [addr.street, addr.city, addr.state, addr.postcode, addr.country]
      .filter(Boolean)
      .join(', ')
  }
  return String(value)
}

const getNestedValue = (obj: any, key: string): any => {
  if (key.includes('.')) {
    const keys = key.split('.')
    let value = obj
    for (const k of keys) {
      value = value?.[k]
    }
    return value
  }
  return obj[key]
}

const transformData = (
  items: any[],
  columns: string[],
  columnDefinitions: any[]
) => {
  return items.map((item) => {
    const row: any = {}
    columns.forEach((colKey) => {
      const colDef = columnDefinitions.find((c) => c.key === colKey)
      if (colDef) {
        if (colKey === 'owners' && item.assetPeople) {
          row[colDef.label] = item.assetPeople
            .map((ap: any) => `${ap.personName} (${ap.percent}%)`)
            .join(', ')
        } else if (colKey === 'owners' && item.assetCompanies) {
          const companies = item.assetCompanies
            .map((ac: any) => `${ac.companyName} (${ac.percent}%)`)
            .join(', ')
          row[colDef.label] = companies
        } else if (colKey === 'borrowers' && item.liabilityPeople) {
          row[colDef.label] = item.liabilityPeople
            .map((lp: any) => `${lp.personName} (${lp.percent}%)`)
            .join(', ')
        } else if (colKey === 'borrowers' && item.liabilityCompanies) {
          const companies = item.liabilityCompanies
            .map((lc: any) => `${lc.companyName} (${lc.percent}%)`)
            .join(', ')
          row[colDef.label] = companies
        } else if (colKey === 'address' && item.address) {
          row[colDef.label] = formatValue(item.address)
        } else {
          const value = getNestedValue(item, colKey)
          row[colDef.label] = formatValue(value)
        }
      }
    })
    return row
  })
}

export const exportToExcel = async (
  data: ExportData,
  settings: ExportSettings
) => {
  const workbook = XLSX.utils.book_new()

  if (settings.entities.people && data.people.length > 0) {
    const peopleData = transformData(
      data.people,
      settings.columns.people,
      PEOPLE_COLUMNS
    )
    const worksheet = XLSX.utils.json_to_sheet(peopleData)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'People')
  }

  if (settings.entities.companies && data.companies.length > 0) {
    const companiesData = transformData(
      data.companies,
      settings.columns.companies,
      COMPANY_COLUMNS
    )
    const worksheet = XLSX.utils.json_to_sheet(companiesData)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Companies')
  }

  if (settings.entities.assets && data.assets.length > 0) {
    const assetsData = transformData(
      data.assets,
      settings.columns.assets,
      ASSET_COLUMNS
    )
    const worksheet = XLSX.utils.json_to_sheet(assetsData)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets')
  }

  if (settings.entities.liabilities && data.liabilities.length > 0) {
    const liabilitiesData = transformData(
      data.liabilities,
      settings.columns.liabilities,
      LIABILITY_COLUMNS
    )
    const worksheet = XLSX.utils.json_to_sheet(liabilitiesData)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Liabilities')
  }

  const fileName = `${settings.fileName}_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

export const exportToCSV = async (
  data: ExportData,
  settings: ExportSettings
) => {
  const sheets: { name: string; data: any[] }[] = []

  if (settings.entities.people && data.people.length > 0) {
    sheets.push({
      name: 'people',
      data: transformData(data.people, settings.columns.people, PEOPLE_COLUMNS),
    })
  }

  if (settings.entities.companies && data.companies.length > 0) {
    sheets.push({
      name: 'companies',
      data: transformData(
        data.companies,
        settings.columns.companies,
        COMPANY_COLUMNS
      ),
    })
  }

  if (settings.entities.assets && data.assets.length > 0) {
    sheets.push({
      name: 'assets',
      data: transformData(data.assets, settings.columns.assets, ASSET_COLUMNS),
    })
  }

  if (settings.entities.liabilities && data.liabilities.length > 0) {
    sheets.push({
      name: 'liabilities',
      data: transformData(
        data.liabilities,
        settings.columns.liabilities,
        LIABILITY_COLUMNS
      ),
    })
  }

  if (sheets.length > 1) {
    sheets.forEach((sheet) => {
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(sheet.data)
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name)
      const fileName = `${settings.fileName}_${sheet.name}_${new Date().toISOString().split('T')[0]}.csv`
      XLSX.writeFile(workbook, fileName, { bookType: 'csv' })
    })
  } else if (sheets.length === 1) {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(sheets[0].data)
    XLSX.utils.book_append_sheet(workbook, worksheet, sheets[0].name)
    const fileName = `${settings.fileName}_${new Date().toISOString().split('T')[0]}.csv`
    XLSX.writeFile(workbook, fileName, { bookType: 'csv' })
  }
}

export const exportToPDF = async (
  data: ExportData,
  settings: ExportSettings
) => {
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
        <title>${settings.fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          table { font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>Report - ${new Date().toLocaleDateString()}</h1>
  `

  if (settings.entities.people && data.people.length > 0) {
    const peopleData = transformData(
      data.people,
      settings.columns.people,
      PEOPLE_COLUMNS
    )
    html += createTableHTML('People', peopleData)
  }

  if (settings.entities.companies && data.companies.length > 0) {
    const companiesData = transformData(
      data.companies,
      settings.columns.companies,
      COMPANY_COLUMNS
    )
    html += createTableHTML('Companies', companiesData)
  }

  if (settings.entities.assets && data.assets.length > 0) {
    const assetsData = transformData(
      data.assets,
      settings.columns.assets,
      ASSET_COLUMNS
    )
    html += createTableHTML('Assets', assetsData)
  }

  if (settings.entities.liabilities && data.liabilities.length > 0) {
    const liabilitiesData = transformData(
      data.liabilities,
      settings.columns.liabilities,
      LIABILITY_COLUMNS
    )
    html += createTableHTML('Liabilities', liabilitiesData)
  }

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
