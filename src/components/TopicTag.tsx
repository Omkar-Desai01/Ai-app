import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface TopicTagProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

const TopicTag: React.FC<TopicTagProps> = ({
  label,
  isSelected,
  onPress,
  onLongPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.tag, isSelected && styles.selectedTag]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
    >
      <Text style={[styles.tagText, isSelected && styles.selectedTagText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "#1C1C1E",
  },
  selectedTag: {
    backgroundColor: "#0A84FF",
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedTagText: {
    color: "#FFFFFF",
  },
});

export default TopicTag;
