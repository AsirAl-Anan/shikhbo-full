import { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signInWithEmailAndPassword as firebaseSignIn,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import app from "../firebase/firebase.init.js";
import instance from "../utils/axios.js";
const axios = instance;

// Create the authentication context
export const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const auth = getAuth(app);
  
  // Reset error state
  const clearError = () => setError(null);
  
  // Create user with email and password
  const createUserWithEmailAndPassword = async (email, password,username) => {
    clearError();
    
    try {
      // Step 1: Create user in Firebase
      const userCredential = await firebaseCreateUser(auth, email, password);
      const user = userCredential.user;
      setFirebaseUser(user);
      
      // Step 2: Create user in MongoDB
      const userData = {
        username: username || email.split("@")[0],
        email: email,
        password: password,
      };
      
      try {
        const dbResponse = await axios.post('/users/signup', userData);
        
        if (dbResponse.status === 201 || dbResponse.status === 200) {
          // Successfully saved to database
          setCurrentUser(dbResponse.data);
          return dbResponse.data; // Return the MongoDB user
        } else {
          // firebaseUser.delete(); // Delete Firebase user if DB save fails
          throw new Error("Failed to create user ");
         
        }
      } catch (dbErr) {
        // If database save fails, attempt to delete Firebase user to keep systems in sync
        console.error("Database error:", dbErr);
        try {
          await user.delete();
        } catch (deleteErr) {
          console.error("Failed to delete Firebase user after DB error:", deleteErr);
        }
        throw new Error("Failed to create user in database: " + dbErr.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  // Sign in with email and password
  const signInWithEmailAndPassword = async (email, password) => {
    clearError();
    
    try {
      // Step 1: Sign in with Firebase
      const userCredential = await firebaseSignIn(auth, email, password);
      const user = userCredential.user;
      setFirebaseUser(user);
      
      // Step 2: Get user from MongoDB
      try {
        const dbResponse = await axios.post(`/users/signin`, { email , password},{withCredentials: true});
        console.log("MongoDB user data:", dbResponse);
        if (dbResponse.status === 200) {
          // Successfully fetched from database
          setCurrentUser(dbResponse.data);
          return dbResponse.data; // Return the MongoDB user
        } else {
          throw new Error("Failed to fetch user data from database");
        }
      } catch (dbErr) {
        console.error("Database error during sign in:", dbErr);
        // Don't sign out here - allow Firebase login to succeed even if DB fetch fails
        // The authentication state change handler will handle this case
        throw new Error("Failed to fetch user data: " + dbErr.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  // Sign up/in using Google popup
  const signupWithPopup = async (providerName = "google") => {
    clearError();
    
    try {
      let authProvider;
      
      if (providerName === "google") {
        authProvider = new GoogleAuthProvider();
      } else {
        throw new Error("Only Google authentication is supported");
      }
      
      const result = await signInWithPopup(auth, authProvider);
      const user = result.user;
      setFirebaseUser(user);
      
      // Prepare user data for MongoDB
      const userData = {
        username: user.displayName || user.email.split("@")[0],
        email: user.email,
        avatar: user.photoURL,
        
      };
      
      // Check if user exists in our database
      try {
        const checkUser = await axios.get(`/users/${user.email}`);
        
        if (checkUser.status === 200) {
          // User exists, just set as current user
          setCurrentUser(checkUser.data);
          return checkUser.data;
        }
      } catch (checkErr) {
        // User doesn't exist in database, create them
        try {
          const dbResponse = await axios.post('/users/signup', userData);
          console.log("MongoDB user data:", dbResponse);
          if (dbResponse.status === 201 || dbResponse.status === 200) {
            
            setCurrentUser(dbResponse.data);
            return dbResponse.data;
          } else {
            throw new Error("Failed to create user in database");
          }
        } catch (createErr) {
          console.error("Error creating user in database:", createErr);
          throw new Error("Failed to create user in database: " + createErr.message);
        }
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  // Login using popup (same as signup for Google)
  const loginWithPopup = async () => {
    return signupWithPopup("google");
  };
  
  // Send email verification
  const sendEmailVerification = async () => {
    clearError();
    if (!auth.currentUser) {
      setError("No user is currently signed in");
      throw new Error("No user is currently signed in");
    }
    
    try {
      await firebaseSendEmailVerification(auth.currentUser);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  // Reset password
  const resetPassword = async (email) => {
    clearError();
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  // Logout user
  const logout = async () => {
    clearError();
    try {
      await signOut(auth);
    const res =  await axios.post('/users/logout');
    console.log(res)
      setCurrentUser(null);
      setFirebaseUser(null);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  // Fetch user data from MongoDB using email
  const fetchUserData = async (email) => {
    try {
      const response = await axios.get(`/users/${email}`);
      console.log("MongoDB user data:", response);
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (err) {
      console.error("Error fetching user data:", err);
      return null;
    }
  };
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        try {
          // If Firebase has a user, get the corresponding MongoDB user
          const dbUser = await fetchUserData(user.email);
          if (dbUser) {
            setCurrentUser(dbUser);
          } else {
            // Firebase has a user but no corresponding DB user
            console.warn("Firebase user exists but no database user found");
            setCurrentUser(null);
          }
        } catch (err) {
          console.error("Error syncing user state:", err);
          setCurrentUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        // No Firebase user
        setCurrentUser(null);
        setLoading(false);
      }
    });
    
    // Cleanup subscription
    return unsubscribe;
  }, [auth]);
  
  // Context value
  const value = {
    currentUser,
    firebaseUser, // Expose the firebaseUser for email verification checks
    loading,
    error,
    clearError,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signupWithPopup,
    loginWithPopup,
    sendEmailVerification,
    resetPassword,
    logout
  };
  console.log(currentUser, "currentUser in context")
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;