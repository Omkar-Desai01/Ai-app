import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface NewsCardProps {
  title: string;
  description: string;
  source?: string;
  publishedAt?: string;
  content?: string;
  url?: string;
  onPress: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  source,
  publishedAt,
  content,
  url,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>
      {(source || publishedAt) && (
        <View style={styles.metaContainer}>
          {source && <Text style={styles.metaText}>{source}</Text>}
          {publishedAt && <Text style={styles.metaText}>{publishedAt}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1C1E",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    color: "#8E8E93",
    fontSize: 14,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  metaText: {
    color: "#8E8E93",
    fontSize: 12,
  },
});

export default NewsCard;
