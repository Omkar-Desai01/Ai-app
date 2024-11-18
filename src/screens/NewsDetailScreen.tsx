import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WebView from "react-native-webview";

interface NewsDetailProps {
  title: string;
  description: string;
  content?: string;
  source?: string;
  publishedAt?: string;
  url?: string;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function NewsDetailScreen({
  title,
  description,
  source,
  publishedAt,
  url,
  onClose,
}: NewsDetailProps) {
  const translateY = new Animated.Value(SCREEN_HEIGHT);
  const overlayOpacity = new Animated.Value(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 10,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          {source && <Text style={styles.source}>{source}</Text>}
          {publishedAt && <Text style={styles.date}>{publishedAt}</Text>}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0A84FF" />
          </View>
        )}

        {url && (
          <WebView
            source={{ uri: url }}
            style={styles.webview}
            onLoadEnd={() => setLoading(false)}
            // Enable JavaScript and other features
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            // Custom injection to improve readability
            injectedJavaScript={`
              document.body.style.backgroundColor = '#1C1C1E';
              document.body.style.color = '#FFFFFF';
            `}
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: Platform.OS === "ios" ? 50 : 20,
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
    backgroundColor: "#1C1C1E",
    zIndex: 1,
  },
  closeButton: {
    padding: 8,
  },
  source: {
    color: "#0A84FF",
    fontSize: 14,
    marginLeft: 16,
  },
  date: {
    color: "#8E8E93",
    fontSize: 14,
    marginLeft: "auto",
  },
  webview: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
  },
});
