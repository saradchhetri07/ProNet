// Helper function to check if the date is after today
export const isAfterToday = (date: Date): boolean => {
  const today = new Date();

  today.setHours(0, 0, 0, 0); // Normalize time to the start of the day
  return date > today;
};

export const convertToDate = (dataString: string) => {
  const date = new Date(dataString);
  // const formattedDate = new Date(date);
  // const finalDate = formattedDate.toISOString().split("T")[0];
  return date;
};
