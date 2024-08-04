export const config = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
  userId: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string,
};
