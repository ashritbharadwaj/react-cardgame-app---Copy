export async function fetchIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip; // Assuming the IP is returned in the 'ip' field
    } catch (error) {
      console.error('Failed to fetch IP:', error);
      return null;
    }
  }