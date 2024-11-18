import axios from "axios";

const API_KEY = "YOUR_NEWS_API_KEY"; // Move this to environment variables in production
const BASE_URL = "https://newsapi.org/v2";

export const fetchNewsByTopic = async (topic) => {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: topic,
        apiKey: API_KEY,
        language: "en",
        sortBy: "publishedAt",
        pageSize: 10,
      },
    });

    return response.data.articles.map((article, index) => ({
      id: index.toString(),
      title: article.title,
      description: article.description,
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};
