import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NewsCard from "../components/NewsCard";
import TopicTag from "../components/TopicTag";
import { fetchNewsByTopic } from "../services/newsApi";
import NewsDetailScreen from "./NewsDetailScreen";
import AddTopicModal from "../components/AddTopicModal";
import TopicActionModal from "../components/TopicActionModal";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source?: string;
  publishedAt?: string;
  content?: string;
  url?: string;
  imageUrl?: string;
}

export default function NewsScreen() {
  const [selectedTopic, setSelectedTopic] = useState("AI");
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [topics, setTopics] = useState<string[]>(["AI", "Tech"]);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [selectedTopicForAction, setSelectedTopicForAction] = useState<
    string | null
  >(null);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [topicToEdit, setTopicToEdit] = useState("");

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

  const handleAddTopic = (newTopic: string) => {
    setTopics([...topics, newTopic]);
    setSelectedTopic(newTopic);
    setShowAddTopic(false);
  };

  const handleTopicLongPress = (topic: string) => {
    setSelectedTopicForAction(topic);
  };

  const handleDeleteTopic = () => {
    if (selectedTopicForAction) {
      const newTopics = topics.filter((t) => t !== selectedTopicForAction);
      setTopics(newTopics);
      if (selectedTopic === selectedTopicForAction) {
        setSelectedTopic(newTopics[0] || "AI");
      }
    }
  };

  const handleEditTopic = () => {
    if (selectedTopicForAction) {
      setTopicToEdit(selectedTopicForAction);
      setIsEditingTopic(true);
    }
  };

  const handleTopicEdit = (newTopic: string) => {
    const newTopics = topics.map((t) =>
      t === selectedTopicForAction ? newTopic : t
    );
    setTopics(newTopics);
    if (selectedTopic === selectedTopicForAction) {
      setSelectedTopic(newTopic);
    }
    setIsEditingTopic(false);
    setSelectedTopicForAction(null);
  };

  const renderTopics = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.topicsScroll}
      contentContainerStyle={styles.topicsContainer}
    >
      {topics.map((topic) => (
        <TopicTag
          key={topic}
          label={topic}
          isSelected={selectedTopic === topic}
          onPress={() => setSelectedTopic(topic)}
          onLongPress={() => handleTopicLongPress(topic)}
        />
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddTopic(true)}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
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
            key={item.id}
            title={item.title}
            description={item.description}
            source={item.source}
            publishedAt={item.publishedAt}
            imageUrl={item.imageUrl}
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
        <NewsDetailScreen
          {...selectedNews}
          url={selectedNews.url}
          onClose={handleCloseDetail}
        />
      )}
      {showAddTopic && (
        <AddTopicModal
          visible={showAddTopic}
          onClose={() => setShowAddTopic(false)}
          onAdd={handleAddTopic}
        />
      )}
      {selectedTopicForAction && (
        <TopicActionModal
          topic={selectedTopicForAction}
          onClose={() => setSelectedTopicForAction(null)}
          onDelete={handleDeleteTopic}
          onEdit={handleEditTopic}
        />
      )}
      {isEditingTopic && (
        <AddTopicModal
          visible={isEditingTopic}
          onClose={() => {
            setIsEditingTopic(false);
            setTopicToEdit("");
          }}
          onAdd={handleTopicEdit}
          initialValue={topicToEdit}
        />
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
  topicsScroll: {
    flexGrow: 0,
    flexShrink: 0,
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
    marginLeft: 8,
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
