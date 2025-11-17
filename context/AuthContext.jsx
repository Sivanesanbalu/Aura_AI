"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Save user to Firestore only if new
  const updateUserInFirestore = async (firebaseUser) => {
    const docRef = doc(db, "users", firebaseUser.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(
        docRef,
        {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          createdAt: new Date(),
        },
        { merge: true }
      );
    }
  };

  // Email Signup
  const signUp = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", result.user.uid), {
      name,
      email: result.user.email,
      uid: result.user.uid,
      createdAt: new Date(),
    });

    router.push("/dashboard");   // 🔥 redirect
    return result;
  };

  // Email Sign-in
  const signIn = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    router.push("/dashboard");   // 🔥 redirect
    return result;
  };

  // Google Login
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await updateUserInFirestore(result.user);

      router.push("/dashboard"); // 🔥 redirect
      return result;
    } catch (err) {
      console.error("Google login error:", err);
      throw err;
    }
  };

  // GitHub Login
  const signInWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await updateUserInFirestore(result.user);

      router.push("/dashboard"); // 🔥 redirect
      return result;
    } catch (err) {
      console.error("GitHub login error:", err);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  // Track logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signInWithGithub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);