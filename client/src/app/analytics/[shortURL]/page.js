import axios from "axios";

async function getAnalytics(shortURL) {
  const res = await axios.get(
    `${process.env.API_URL}/api/url/analytics/${shortURL}`
  );
  return res.data;
}

export default async function AnalyticsPage({ params }) {
  const { shortURL } = params;
  const data = await getAnalytics(shortURL);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Analytics for {shortURL}</h1>
      <p>Total Clicks: {data.clicks}</p>
    </div>
  );
}
