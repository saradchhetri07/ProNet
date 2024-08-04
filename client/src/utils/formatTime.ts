export const formatTimestamp=(timestamp: string): string =>{
    // Implement your timestamp formatting logic here
    return new Date(timestamp).toLocaleString();
  }