import axios from "axios";



export const payForLesson = async (payload: any) => {

  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`,
    payload,
    { withCredentials: true }
  );

  if (!res.data.url) throw new Error("Stripe session URL not returned");

  return res.data.url;
};
