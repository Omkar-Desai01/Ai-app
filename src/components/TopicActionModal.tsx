import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TopicActionModalProps {
  topic: string;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function TopicActionModal({
  topic,
  onClose,
  onDelete,
  onEdit,
}: TopicActionModalProps) {
  const translateY = new Animated.Value(SCREEN_HEIGHT);
  const overlayOpacity = new Animated.Value(0);

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

  const handleClose = (callback?: () => void) => {
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
      callback?.();
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.overlay, { opacity: overlayOpacity }]}
        pointerEvents="auto"
      >
        <TouchableOpacity
          style={styles.overlayTouch}
          onPress={() => handleClose()}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{topic}</Text>
        </View>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleClose(onEdit)}
        >
          <Ionicons name="pencil" size={24} color="#0A84FF" />
          <Text style={styles.optionText}>Edit Topic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, styles.deleteOption]}
          onPress={() => handleClose(onDelete)}
        >
          <Ionicons name="trash" size={24} color="#FF453A" />
          <Text style={[styles.optionText, styles.deleteText]}>
            Delete Topic
          </Text>
        </TouchableOpacity>
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
  overlayTouch: {
    flex: 1,
  },
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1C1C1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2E",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  optionText: {
    color: "#0A84FF",
    fontSize: 17,
  },
  deleteOption: {
    borderTopWidth: 1,
    borderTopColor: "#2C2C2E",
  },
  deleteText: {
    color: "#FF453A",
  },
});
