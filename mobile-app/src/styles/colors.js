// Color constants converted from CSS variables
export const colors = {
  // Base colors
  background: '#1A1A1A',
  foreground: '#FFFFFF',
  card: '#2D2D2D',
  cardForeground: '#FFFFFF',
  primary: '#0066CC',
  primaryForeground: '#FFFFFF',
  secondary: '#333333',
  secondaryForeground: '#FFFFFF',
  muted: '#333333',
  mutedForeground: '#CCCCCC',
  accent: '#0088FF',
  accentForeground: '#FFFFFF',
  border: '#444444',
  input: '#333333',
  ring: '#0066CC',
  
  // Lifeline-specific colors
  emergency: '#FF0000',
  emergencyForeground: '#FFFFFF',
  success: '#00CC00',
  successForeground: '#000000',
  warning: '#FF6600',
  warningForeground: '#FFFFFF',
  technical: '#00FF00',
  technicalForeground: '#000000',
  network: '#0088FF',
  networkForeground: '#FFFFFF',
  surface: '#2D2D2D',
  surfaceForeground: '#FFFFFF',
  
  // Chart colors
  chart1: '#00CC00',
  chart2: '#0066CC',
  chart3: '#FF6600',
  chart4: '#00FF00',
  chart5: '#0088FF',
};

// Status color helper function
export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'success':
    case 'online':
    case 'active':
      return colors.success;
    case 'error':
    case 'emergency':
      return colors.emergency;
    case 'warning':
      return colors.warning;
    case 'technical':
      return colors.technical;
    case 'network':
      return colors.network;
    default:
      return colors.mutedForeground;
  }
};