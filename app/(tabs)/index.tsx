import React from "react";
import { View, StyleSheet } from "react-native";
import NewsScreen from "../../src/screens/NewsScreen";

export default function NewsTab() {
  return (
    <View style={styles.container}>
      <NewsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
