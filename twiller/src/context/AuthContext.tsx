"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import axiosInstance from "../lib/axiosInstance";

interface User {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  joinedDate: string;
  email: string;
  website: string;
  location: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => Promise<void>;
  updateProfile: (profileData: {
    displayName: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
  }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  googlesignin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const unsubcribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.email) {
        try {
          const res = await axiosInstance.get("/loggedinuser", {
            params: { email: firebaseUser.email },
          });

          if (res.data) {
            setUser(res.data);
            localStorage.setItem("twitter-user", JSON.stringify(res.data));
          }
        } catch (err) {
          console.log("Failed to fetch user:", err);
        }
      } else {
        setUser(null);
        localStorage.removeItem("twitter-user");
      }
      setIsLoading(false);
    });
    return () => unsubcribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const usercred = await signInWithEmailAndPassword(auth, email, password);
    const firebaseuser = usercred.user;
    const res = await axiosInstance.get("/loggedinuser", {
      params: { email: firebaseuser.email },
    });
    if (res.data) {
      setUser(res.data);
      localStorage.setItem("twitter-user", JSON.stringify(res.data));
    }
    setIsLoading(false);
  };

  const signup = async (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => {
    setIsLoading(true);
    const usercred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = usercred.user;
    const newuser: any = {
      username,
      displayName,
      avatar: user.photoURL || "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=400",
      email: user.email,
    };
    const registerRes = await axiosInstance.post("/register", newuser);
    const data = registerRes.data;

    if (data.success && data.user) {
      const userData = data.user;
      setUser(userData);
      localStorage.setItem("twitter-user", JSON.stringify(userData));
    } else {
      throw new Error("Login/Register failed: " + (data.error || "No user data returned"));
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
    localStorage.removeItem("twitter-user");
  };

  const updateProfile = async (profileData: {
    displayName: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
  }) => {
    if (!user) return;

    setIsLoading(true);
    const updatedUser: User = {
      ...user,
      ...profileData,
    };
    const res = await axiosInstance.patch(
      `/userupdate/${user.email}`,
      updatedUser
    );
    if (res.data) {
      setUser(updatedUser);
      localStorage.setItem("twitter-user", JSON.stringify(updatedUser));
    }
    setIsLoading(false);
  };

  const googlesignin = async () => {
    setIsLoading(true);

    try {
      const googleauthprovider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleauthprovider);
      const firebaseuser = result.user;

      if (!firebaseuser?.email) {
        throw new Error("No email found in Google account");
      }

      console.log("Firebase user:", firebaseuser);

      let userData;

      try {
        // Try to get existing user
        console.log("Checking for existing user...");
        const res = await axiosInstance.get("/loggedinuser", {
          params: { email: firebaseuser.email },
        });
        
        console.log("Existing user response:", res.data);
        
        // Handle response structure more carefully
        if (res.data) {
          if (res.data.success && res.data.user) {
            userData = res.data.user;
          } else if (res.data.email) {
            userData = res.data;
          } else if (typeof res.data === 'object') {
            userData = res.data;
          }
        }
      } catch (err: any) {
        console.log("User not found, registering new user. Error:", err.message);
        
        // If user doesn't exist, register them
        const newuser = {
          username: firebaseuser.email.split("@")[0],
          displayName: firebaseuser.displayName || "User",
          avatar: firebaseuser.photoURL || "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=400",
          email: firebaseuser.email,
          bio: "",
          website: "",
          location: "",
          joinedDate: new Date().toISOString(),
        };

        console.log("Registering new user with data:", newuser);
        
        const registerRes = await axiosInstance.post("/register", newuser);
        console.log("Registration response:", registerRes.data);
        
        // Handle registration response structure
        if (registerRes.data) {
          if (registerRes.data.success && registerRes.data.user) {
            userData = registerRes.data.user;
          } else if (registerRes.data.email) {
            userData = registerRes.data;
          } else if (typeof registerRes.data === 'object') {
            userData = registerRes.data;
          }
        }
      }

      console.log("Final userData before validation:", userData);

      // If we still don't have userData from API, create a fallback user object
      if (!userData) {
        console.warn("No user data from API, creating fallback user object");
        userData = {
          _id: `google-${firebaseuser.uid}`,
          username: firebaseuser.email.split("@")[0],
          displayName: firebaseuser.displayName || "User",
          avatar: firebaseuser.photoURL || "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=400",
          bio: "",
          joinedDate: new Date().toISOString(),
          email: firebaseuser.email,
          website: "",
          location: "",
        };
      }

      // Validate and finalize user data
      if (userData && userData.email) {
        const finalUserData: User = {
          _id: userData._id || `google-${firebaseuser.uid}`,
          username: userData.username || firebaseuser.email.split("@")[0],
          displayName: userData.displayName || firebaseuser.displayName || "User",
          avatar: userData.avatar || firebaseuser.photoURL || "https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=400",
          bio: userData.bio || "",
          joinedDate: userData.joinedDate || new Date().toISOString(),
          email: userData.email,
          website: userData.website || "",
          location: userData.location || "",
        };

        console.log("Final user data to set:", finalUserData);
        
        setUser(finalUserData);
        localStorage.setItem("twitter-user", JSON.stringify(finalUserData));
      } else {
        console.error("Invalid user data structure - no email:", userData);
        throw new Error("Login/Register failed: No valid user data returned from server");
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      alert(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        updateProfile,
        logout,
        isLoading,
        googlesignin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};