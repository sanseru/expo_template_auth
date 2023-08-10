import { Text, View } from "react-native";

import { useAuth } from "./context/auth";
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  const { signOut } = useAuth();
  const [userData, setUserData] = useState(null); // State to store the retrieved user data

  // Function to retrieve user data from SecureStore
  const fetchUserData = async () => {
    try {
      const result = await SecureStore.getItemAsync("user");
      console.log(result);
      if (result) {
        setUserData(JSON.parse(result));
      }
    } catch (error) {
      console.error("Error fetching user data from SecureStore", error);
    }
  };

  useEffect(() => {
    fetchUserData()
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {userData && <Text>Welcome, {userData.data.name}!</Text>}
      <Text onPress={() => signOut()}>Sign Out</Text>
    </View>
  );
}
