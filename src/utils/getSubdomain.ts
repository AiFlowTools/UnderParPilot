import { isNil } from 'lodash';

export function getSubdomain(): string | null {
  const hostname = window.location.hostname;
  
  // Handle localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'dev';
  }
  
  // Handle IP addresses
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return 'dev';
  }
  
  // Extract subdomain from hostname
  const parts = hostname.split('.');
  
  // Return null if no subdomain exists
  if (parts.length <= 2) {
    return null;
  }
  
  // Return the first part as subdomain
  return parts[0];
}