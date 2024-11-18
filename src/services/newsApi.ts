import axios from "axios";

const BASE_URL = "https://newsapi.org/v2";
const API_KEY = "d0f81ddfe28f4ba69b93ec730271e896";

interface NewsAPIResponse {
  status: string;
  articles: Array<{
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
      id: string | null;
      name: string;
    };
    content?: string;
  }>;
}

const isContentRelevant = (
  content: string,
  topic: string,
  threshold: number = 0.7
): boolean => {
  // Normalize strings for comparison
  const normalizeString = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9\s]/g, "");

  const normalizedContent = normalizeString(content);
  const normalizedTopic = normalizeString(topic);
  const topicWords = normalizedTopic.split(/\s+/);

  // Check if any topic word or the whole phrase appears in the content
  const hasExactMatch = normalizedContent.includes(normalizedTopic);
  if (hasExactMatch) return true;

  // Count how many topic words appear in the content
  const matchingWords = topicWords.filter((word) =>
    normalizedContent.includes(word)
  );

  // Calculate relevance score
  const relevanceScore = matchingWords.length / topicWords.length;
  return relevanceScore >= threshold;
};

export const fetchNewsByTopic = async (topic: string) => {
  try {
    // Fetch more articles initially to allow for filtering
    const params = {
      q: topic,
      language: "en",
      sortBy: "publishedAt",
      pageSize: 50, // Increased to get more candidates for filtering
      apiKey: API_KEY,
    };

    const response = await axios.get<NewsAPIResponse>(
      `${BASE_URL}/everything`,
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

    // Filter articles for relevance
    const relevantArticles = response.data.articles.filter((article) => {
      const contentToCheck = [
        article.title,
        article.description,
        article.content,
      ]
        .filter(Boolean)
        .join(" ");

      return isContentRelevant(contentToCheck, topic);
    });

    // Take the top 10 most relevant articles
    return relevantArticles.slice(0, 10).map((article, index) => ({
      id: index.toString(),
      title: article.title,
      description: article.description || "No description available",
      content: article.content || article.description || "No content available",
      source: article.source.name,
      publishedAt: new Date(article.publishedAt).toLocaleDateString(),
      url: article.url,
      imageUrl: article.urlToImage,
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
