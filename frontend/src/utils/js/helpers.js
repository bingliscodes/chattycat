export const getCurrentTime = () => {
  const now = new Date(Date.now());
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, "0");
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  const time = `${hour12}:${m} ${suffix}`;

  return time;
};
