// BankSys Color Palette following 70-20-10 rule
export const BankSysColors = {
  // 70% - Dominant Color (White backgrounds, main content)
  white: '#FFFFFF',
  lightGray: '#F8F9FA',
  offWhite: '#FAFAFA',
  
  // 20% - Secondary Color (Red branding, headers, primary buttons)
  red: '#FF0000',
  redLight: '#FF3333',
  redDark: '#CC0000',
  redTransparent: 'rgba(255, 0, 0, 0.1)',
  
  // 10% - Accent Color (Yellow CTAs, highlights, notifications)
  yellow: '#FFC700',
  yellowLight: '#FFD633',
  yellowDark: '#E6B300',
  
  // Neutral colors for text and borders
  black: '#000000',
  darkGray: '#333333',
  mediumGray: '#666666',
  lightBorder: '#E5E5E5',
  
  // Status colors
  success: '#28A745',
  error: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
  
  // Transaction type colors
  income: '#28A745',
  expense: '#FF0000',
  transfer: '#6C757D',
  
  // Background variations
  cardBackground: '#FFFFFF',
  screenBackground: '#F8F9FA',
  modalBackground: 'rgba(0, 0, 0, 0.5)',
};

// Predefined color schemes for components
export const ColorSchemes = {
  primaryButton: {
    backgroundColor: BankSysColors.red,
    color: BankSysColors.white,
  },
  secondaryButton: {
    backgroundColor: BankSysColors.white,
    color: BankSysColors.red,
    borderColor: BankSysColors.red,
  },
  accentButton: {
    backgroundColor: BankSysColors.yellow,
    color: BankSysColors.black,
  },
  card: {
    backgroundColor: BankSysColors.white,
    borderColor: BankSysColors.lightBorder,
  },
  header: {
    backgroundColor: BankSysColors.red,
    color: BankSysColors.white,
  }
};