export interface ColumnDefinition {
  key: string
  label: string
}

export const PEOPLE_COLUMNS: ColumnDefinition[] = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phoneMobile', label: 'Mobile' },
  { key: 'phoneWork', label: 'Work Phone' },
  { key: 'dateOfBirth', label: 'Date of Birth' },
  { key: 'gender', label: 'Gender' },
  { key: 'maritalStatus', label: 'Marital Status' },
  { key: 'brokerName', label: 'Broker' },
  { key: 'createdAt', label: 'Created Date' },
] as const

export const COMPANY_COLUMNS: ColumnDefinition[] = [
  { key: 'name', label: 'Company Name' },
  { key: 'tradingName', label: 'Trading Name' },
  { key: 'type', label: 'Type' },
  { key: 'abn', label: 'ABN' },
  { key: 'acn', label: 'ACN' },
  { key: 'industry', label: 'Industry' },
  { key: 'email', label: 'Email' },
  { key: 'phoneWork', label: 'Phone' },
  { key: 'website', label: 'Website' },
  { key: 'brokerName', label: 'Broker' },
  { key: 'createdAt', label: 'Created Date' },
] as const

export const ASSET_COLUMNS: ColumnDefinition[] = [
  { key: 'name', label: 'Asset Name' },
  { key: 'propertyType', label: 'Property Type' },
  { key: 'zoningType', label: 'Zoning' },
  { key: 'value', label: 'Value' },
  { key: 'valuationDate', label: 'Valuation Date' },
  { key: 'isInvestment', label: 'Investment' },
  { key: 'rentalIncomeValue', label: 'Rental Income' },
  { key: 'addressLine', label: 'Address' },
  { key: 'createdAt', label: 'Created Date' },
] as const

export const LIABILITY_COLUMNS: ColumnDefinition[] = [
  { key: 'name', label: 'Liability Name' },
  { key: 'lenderName', label: 'Lender' },
  { key: 'loanName', label: 'Loan Product' },
  { key: 'financePurpose', label: 'Purpose' },
  { key: 'amount', label: 'Original Amount' },
  { key: 'initialBalance', label: 'Current Balance' },
  { key: 'repaymentAmount', label: 'Repayment' },
  { key: 'repaymentFrequency', label: 'Frequency' },
  { key: 'settlementRate', label: 'Interest Rate' },
  { key: 'createdAt', label: 'Created Date' },
] as const
