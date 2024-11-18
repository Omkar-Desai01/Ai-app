import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const TOPIC_MIN_LENGTH = 2;
const TOPIC_MAX_LENGTH = 20;
const RESTRICTED_WORDS = ["hate", "nsfw", "xxx", "violence"]; // Add restricted words
const SUGGESTED_TOPICS = [
  "Technology",
  "Science",
  "Health",
  "Business",
  "Sports",
  "Entertainment",
  "Politics",
  "Environment",
  "Education",
  "Food",
];

interface AddTopicModalProps {
  visible?: boolean;
  onClose: () => void;
  onAdd: (topic: string) => void;
  initialValue?: string;
}

const AddTopicModal: React.FC<AddTopicModalProps> = ({
  visible = true,
  onClose,
  onAdd,
  initialValue = "",
}) => {
  const [topic, setTopic] = useState(initialValue);
  const [error, setError] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (topic) {
      const filtered = SUGGESTED_TOPICS.filter((suggestion) =>
        suggestion.toLowerCase().includes(topic.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [topic]);

  const validateTopic = (text: string): boolean => {
    if (text.length < TOPIC_MIN_LENGTH) {
      setError(`Topic must be at least ${TOPIC_MIN_LENGTH} characters long`);
      return false;
    }

    if (text.length > TOPIC_MAX_LENGTH) {
      setError(`Topic cannot exceed ${TOPIC_MAX_LENGTH} characters`);
      return false;
    }

    if (RESTRICTED_WORDS.some((word) => text.toLowerCase().includes(word))) {
      setError("This topic contains restricted words");
      return false;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(text)) {
      setError("Topic can only contain letters, numbers, and spaces");
      return false;
    }

    setError("");
    return true;
  };

  const handleAddTopic = () => {
    if (validateTopic(topic)) {
      onAdd(topic);
      setTopic("");
      onClose();
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setTopic(suggestion);
    setFilteredSuggestions([]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Topic</Text>

          <TextInput
            style={styles.input}
            value={topic}
            onChangeText={setTopic}
            placeholder="Enter topic name"
            maxLength={TOPIC_MAX_LENGTH}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {filteredSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Suggestions:</Text>
              <FlatList
                data={filteredSuggestions}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionPress(item)}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleAddTopic}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  suggestionsContainer: {
    marginVertical: 10,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  suggestionItem: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 15,
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ff4444",
  },
  addButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default AddTopicModal;
