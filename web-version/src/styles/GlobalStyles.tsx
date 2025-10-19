import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    /* BankSys Color Palette - 70-20-10 Rule */
    --color-white: #FFFFFF;
    --color-light-gray: #F8F9FA;
    --color-off-white: #FAFAFA;
    
    --color-red: #FF0000;
    --color-red-light: #FF3333;
    --color-red-dark: #CC0000;
    --color-red-transparent: rgba(255, 0, 0, 0.1);
    
    --color-yellow: #FFC700;
    --color-yellow-light: #FFD633;
    --color-yellow-dark: #E6B300;
    
    --color-black: #000000;
    --color-dark-gray: #333333;
    --color-medium-gray: #666666;
    --color-light-border: #E5E5E5;
    
    --color-success: #28A745;
    --color-error: #DC3545;
    --color-warning: #FFC107;
    --color-info: #17A2B8;
    
    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-xxl: 48px;
    
    /* Border Radius */
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    --border-radius-xl: 16px;
    
    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
    
    /* Typography */
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 30px;
    --font-size-4xl: 36px;
    
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    /* Z-Index */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal: 1040;
    --z-popover: 1050;
    --z-tooltip: 1060;
    --z-toast: 1070;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif';
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-normal);
    line-height: 1.5;
    color: var(--color-dark-gray);
    background-color: var(--color-light-gray);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  /* Remove default button styles */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  /* Remove default link styles */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* Remove default list styles */
  ul, ol {
    list-style: none;
  }

  /* Remove default input styles */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid var(--color-red);
    outline-offset: 2px;
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-light-gray);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-medium-gray);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-dark-gray);
  }

  /* Selection styles */
  ::selection {
    background: var(--color-red-transparent);
    color: var(--color-red-dark);
  }

  /* Utility classes */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }

  .container-fluid {
    width: 100%;
    padding: 0 var(--spacing-md);
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .flex {
    display: flex;
  }

  .flex-column {
    flex-direction: column;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .items-center {
    align-items: center;
  }

  .w-full {
    width: 100%;
  }

  .h-full {
    height: 100%;
  }

  /* Responsive breakpoints */
  @media (max-width: 768px) {
    .container {
      padding: 0 var(--spacing-sm);
    }
    
    html {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: 0 var(--spacing-xs);
    }
  }

  /* Print styles */
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    
    a, a:visited {
      text-decoration: underline;
    }
    
    .no-print {
      display: none !important;
    }
  }

  /* Animation utilities */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-slide-up {
    animation: slideInUp 0.3s ease-out;
  }

  .animate-slide-down {
    animation: slideInDown 0.3s ease-out;
  }

  /* Loading states */
  .loading {
    position: relative;
    pointer-events: none;
    opacity: 0.7;
  }

  .loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid var(--color-light-border);
    border-left-color: var(--color-red);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Error states */
  .error {
    color: var(--color-error);
    background-color: rgba(220, 53, 69, 0.1);
    border: 1px solid rgba(220, 53, 69, 0.2);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-sm) var(--spacing-md);
  }

  /* Success states */
  .success {
    color: var(--color-success);
    background-color: rgba(40, 167, 69, 0.1);
    border: 1px solid rgba(40, 167, 69, 0.2);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-sm) var(--spacing-md);
  }
`;