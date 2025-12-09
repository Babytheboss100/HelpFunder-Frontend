// Format currency in NOK
export const formatCurrency = (amount, currency = 'NOK') => {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format number with spaces as thousand separator
export const formatNumber = (number) => {
  return new Intl.NumberFormat('nb-NO').format(number);
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('nb-NO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

// Format date and time
export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('nb-NO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// Format relative time (e.g., "2 dager siden")
export const formatRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Nå nettopp';
  if (diffMins < 60) return `${diffMins} minutt${diffMins > 1 ? 'er' : ''} siden`;
  if (diffHours < 24) return `${diffHours} time${diffHours > 1 ? 'r' : ''} siden`;
  if (diffDays < 7) return `${diffDays} dag${diffDays > 1 ? 'er' : ''} siden`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} uke${Math.floor(diffDays / 7) > 1 ? 'r' : ''} siden`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} måned${Math.floor(diffDays / 30) > 1 ? 'er' : ''} siden`;
  return `${Math.floor(diffDays / 365)} år siden`;
};

// Format time remaining
export const formatTimeRemaining = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end - now;
  
  if (diffMs <= 0) return 'Avsluttet';
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) return `${diffDays}D ${diffHours}H`;
  if (diffHours > 0) return `${diffHours}H`;
  
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffMins}M`;
};

// Calculate percentage
export const calculatePercentage = (current, goal) => {
  if (!goal || goal === 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate slug from text
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[æ]/g, 'ae')
    .replace(/[ø]/g, 'o')
    .replace(/[å]/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Validate email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate Norwegian phone
export const isValidNorwegianPhone = (phone) => {
  const regex = /^(\+47)?[0-9]{8}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

// Format Norwegian phone
export const formatNorwegianPhone = (phone) => {
  const cleaned = phone.replace(/\s/g, '').replace('+47', '');
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

// Get initials from name
export const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
