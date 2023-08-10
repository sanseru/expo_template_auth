import { router, useRootNavigationState, useSegments } from "expo-router";
import React from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = React.createContext(null);

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user) {
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  React.useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    // Fetch user data from SecureStore
    const fetchUserData = async () => {
      try {
        const result = await SecureStore.getItemAsync("user");
        if (result) {
          const userData = JSON.parse(result);

          // Check if the user is signed in and the initial segment is not in the auth group
          if (!userData && !inAuthGroup) {
            // Redirect to the sign-in page.
            router.replace("/sign-in");
          } else if (userData && inAuthGroup) {
            // Redirect away from the sign-in page.
            router.replace("/");
          }
        } else {
          // If no user data is found, redirect to the sign-in page
          if (!inAuthGroup) {
            router.replace("/sign-in");
          }
        }
      } catch (error) {
        console.error("Error fetching user data from SecureStore", error);
      }
    };

    fetchUserData();

    console.log(inAuthGroup);
    console.log(user);

    // if (
    //   // If the user is not signed in and the initial segment is not anything in the auth group.
    //   !user &&
    //   !inAuthGroup
    // ) {
    //   // Redirect to the sign-in page.
    //   router.replace("/sign-in");
    // } else if (user && inAuthGroup) {
    //   // Redirect away from the sign-in page.
    //   router.replace("/");
    // }
  }, [user, segments]);
}

export function Provider(props) {
  const [user, setAuth] = React.useState(null);
  useProtectedRoute(user);
  const signIn = async (email, password) => {
    try {
      console.log(email);
      // Gantilah bagian ini dengan panggilan API login yang sesuai.
      // Misalnya, jika menggunakan fetch:
      var raw = JSON.stringify({
        email: email,
        password: password,
      });

      const response = await fetch(
        "https://3a04-110-138-86-164.ngrok-free.app/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: raw,
        }
      );

      const userData = await response.json();
      if (userData.success) {
        setAuth(userData);
        console.log(userData.success);
        // Simpan informasi autentikasi di AsyncStorage.
        await SecureStore.setItemAsync("user", JSON.stringify(userData));
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  const signOut = () => {
    setAuth(null);
    SecureStore.deleteItemAsync("user");
    router.replace("/sign-in");
  };

  return (
    <AuthContext.Provider
      // value={{
      //   signIn: () => setAuth({}),
      //   signOut: () => setAuth(null),
      //   user,
      // }}
      value={{
        signIn,
        signOut,
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
