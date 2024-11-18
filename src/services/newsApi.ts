import axios from "axios";

const BASE_URL = "https://newsapi.org/v2";
const API_KEY = "d0f81ddfe28f4ba69b93ec730271e896";

interface NewsAPIResponse {
  status: string;
  articles: Array<{
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    source: {
      id: string | null;
      name: string;
    };
    content?: string;
  }>;
}

export const fetchNewsByTopic = async (topic: string) => {
  try {
    const endpoint =
      topic.toLowerCase() === "tech" ? "/top-headlines" : "/everything";

    const params =
      topic.toLowerCase() === "tech"
        ? {
            category: "technology",
            language: "en",
            pageSize: 10,
            apiKey: API_KEY,
          }
        : {
            q: topic,
            language: "en",
            sortBy: "publishedAt",
            pageSize: 10,
            apiKey: API_KEY,
          };

    const response = await axios.get<NewsAPIResponse>(
      `${BASE_URL}${endpoint}`,
      {
        params,
        headers: {
          Authorization: API_KEY,
        },
      }
    );

    if (response.data.status !== "ok") {
      throw new Error("Failed to fetch news");
    }

    return response.data.articles.map((article, index) => ({
      id: index.toString(),
      title: article.title,
      description: article.description || "No description available",
      content: article.content || article.description || "No content available",
      source: article.source.name,
      publishedAt: new Date(article.publishedAt).toLocaleDateString(),
      url: article.url,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("News API Error:", error.response?.data || error.message);
    } else {
      console.error("Error fetching news:", error);
    }
    throw error;
  }
};
