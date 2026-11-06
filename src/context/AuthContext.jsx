import { useState } from "react";
import { AuthContext } from "./AuthContextStore";

const USERS_STORAGE_KEY = "shopease-users";
const CURRENT_USER_STORAGE_KEY = "shopease-current-user";

function readCurrentUser() {
  const savedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  return savedUser ? JSON.parse(savedUser) : null;
}

function readUsers() {
  const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  return savedUsers ? JSON.parse(savedUsers) : [];
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readCurrentUser);

  function register({ name, email, password }) {
    const users = readUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((registeredUser) => registeredUser.email === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }

    const registeredUser = {
      name: name.trim(),
      email: normalizedEmail,
      password,
    };
    const currentUser = { name: registeredUser.name, email: normalizedEmail };

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, registeredUser]));
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    setUser(currentUser);
  }

  function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const registeredUser = readUsers().find(
      (savedUser) =>
        savedUser.email === normalizedEmail && savedUser.password === password,
    );

    if (!registeredUser) {
      throw new Error("Invalid email or password.");
    }

    const currentUser = {
      name: registeredUser.name,
      email: registeredUser.email,
    };
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    setUser(currentUser);
  }

  function updateProfile({ name, email }) {
    if (!user) {
      throw new Error("You must be logged in to update your profile.");
    }

    const users = readUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const userIndex = users.findIndex(
      (registeredUser) => registeredUser.email === user.email,
    );

    if (userIndex === -1) {
      throw new Error("Your account could not be found.");
    }

    if (
      users.some(
        (registeredUser, index) =>
          index !== userIndex && registeredUser.email === normalizedEmail,
      )
    ) {
      throw new Error("An account with this email already exists.");
    }

    const updatedUser = { ...users[userIndex], name: name.trim(), email: normalizedEmail };
    const updatedUsers = users.map((registeredUser, index) =>
      index === userIndex ? updatedUser : registeredUser,
    );
    const currentUser = { name: updatedUser.name, email: normalizedEmail };

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    setUser(currentUser);
  }

  function logout() {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
