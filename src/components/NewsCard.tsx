import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NewsCardProps {
  title: string;
  description: string;
  source?: string;
  publishedAt?: string;
  imageUrl?: string;
  onPress: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = 100;

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  source,
  publishedAt,
  imageUrl,
  onPress,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.spring(contentHeight, {
      toValue: isExpanded ? 0 : 1,
      useNativeDriver: false,
    }).start();
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={toggleExpand}
      activeOpacity={0.9}
    >
      <View style={styles.contentContainer}>
        <View style={styles.mainContent}>
          <View style={styles.textContent}>
            <Text
              style={styles.title}
              numberOfLines={isExpanded ? undefined : 2}
            >
              {title}
            </Text>
            <Text
              style={styles.description}
              numberOfLines={isExpanded ? undefined : 2}
            >
              {isExpanded ? content || description : description}
            </Text>
            {(source || publishedAt) && (
              <View style={styles.metaContainer}>
                {source && <Text style={styles.metaText}>{source}</Text>}
                {publishedAt && (
                  <Text style={styles.metaText}>{publishedAt}</Text>
                )}
              </View>
            )}
          </View>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
          >
            <Text style={styles.readMoreText}>
              {isExpanded ? "Show Less" : "Read More"}
            </Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color="#0A84FF"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.webViewButton}
            onPress={(e) => {
              e.stopPropagation();
              onPress();
            }}
          >
            <Ionicons name="globe-outline" size={16} color="#FFFFFF" />
            <Text style={styles.webViewButtonText}>Full Article</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1C1E",
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  contentContainer: {
    padding: 12,
  },
  mainContent: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  textContent: {
    flex: 1,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    backgroundColor: "#2C2C2E",
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
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  metaText: {
    color: "#8E8E93",
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#2C2C2E",
    paddingTop: 12,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#0A84FF",
    flex: 1,
    justifyContent: "center",
  },
  readMoreText: {
    color: "#0A84FF",
    fontSize: 14,
    fontWeight: "500",
  },
  webViewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A84FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    flex: 1,
    justifyContent: "center",
  },
  webViewButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default NewsCard;
