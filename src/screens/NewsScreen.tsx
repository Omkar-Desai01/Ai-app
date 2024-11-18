import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NewsCard from "../components/NewsCard";
import TopicTag from "../components/TopicTag";
import { fetchNewsByTopic } from "../services/newsApi";
import NewsDetailScreen from "./NewsDetailScreen";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source?: string;
  publishedAt?: string;
  content?: string;
}

export default function NewsScreen() {
  const [selectedTopic, setSelectedTopic] = useState("AI");
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const topics = ["AI", "Tech"];

  useEffect(() => {
    loadNews(selectedTopic);
  }, [selectedTopic]);

  const loadNews = async (topic: string) => {
    setLoading(true);
    setError(null);
    try {
      const articles = await fetchNewsByTopic(topic);
      setNewsData(articles);
    } catch (err) {
      setError("Failed to load news");
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };

  const renderTopics = () => (
    <View style={styles.topicsContainer}>
      {topics.map((topic) => (
        <TopicTag
          key={topic}
          label={topic}
          isSelected={selectedTopic === topic}
          onPress={() => setSelectedTopic(topic)}
        />
      ))}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0A84FF" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={newsData}
        renderItem={({ item }) => (
          <NewsCard
            title={item.title}
            description={item.description}
            source={item.source}
            publishedAt={item.publishedAt}
            content={item.content}
            onPress={() => handleNewsPress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={() => loadNews(selectedTopic)}
      />
    );
  };

  const handleNewsPress = (news: NewsItem) => {
    setSelectedNews(news);
  };

  const handleCloseDetail = () => {
    setSelectedNews(null);
  };

  return (
    <View style={styles.container}>
      {renderTopics()}
      {renderContent()}
      {selectedNews && (
        <NewsDetailScreen {...selectedNews} onClose={handleCloseDetail} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: 4,
  },
  topicsContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF453A",
    fontSize: 16,
  },
});
