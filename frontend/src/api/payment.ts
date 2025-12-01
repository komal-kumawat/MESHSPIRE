import API from "../api";

export const payForLesson = async (payload: {
  tutorId: string;
  lessonId: string;
}) => {
  const res = await API.post("/payment/create-checkout-session", payload);

  if (!res.data.url) throw new Error("Stripe session URL not returned");

  return res.data.url;
};
