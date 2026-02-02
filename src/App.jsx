/**
 * App Component
 * Main application with routing and authentication
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';

/**
 * Protected Route Component
 * Redirects unauthenticated users to sign in
 */
function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

/**
 * Public Route Component
 * Shows landing page for unauthenticated users
 * Redirects authenticated users to chat
 */
function PublicRoute({ children }) {
  return (
    <>
      <SignedOut>{children}</SignedOut>
      <SignedIn>
        <Navigate to="/chat" replace />
      </SignedIn>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public landing page */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />

      {/* Protected chat page */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}