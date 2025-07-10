// Utility function to format dates consistently (fixes hydration issues)
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  // Format: YYYY-MM-DD HH:mm (24h, UTC)
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
}

// Generate a random avatar color
export function getAvatarColor(name: string | null | undefined): string {
  // Handle null/undefined cases
  if (!name || typeof name !== 'string') {
    name = 'User';
  }
  
  const colors = [
    '#1877f2', '#42a5f5', '#42b883', '#ff6b6b', 
    '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

// Get initials from name
export function getInitials(name: string | null | undefined): string {
  // Handle null/undefined cases
  if (!name || typeof name !== 'string') {
    return 'U';
  }
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
} 