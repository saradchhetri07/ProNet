// Helper function to check if the date is after today
export const isAfterToday = (date: Date): boolean => {
  const today = new Date();

  today.setHours(0, 0, 0, 0); // Normalize time to the start of the day
  return date > today;
};

export const convertToDate = (dataString: string) => {
  const date = new Date(dataString);
  return date;
};
