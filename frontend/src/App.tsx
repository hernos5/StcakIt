import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { AskQuestionPage } from './pages/AskQuestionPage';
import { QuestionDetailPage } from './pages/QuestionDetailPage';
import { TagsPage } from './pages/TagsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from 'sonner';
export function App() {
  return <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="question/:id" element={<QuestionDetailPage />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="profile/:username" element={<ProfilePage />} />
          {/* Protected Routes */}
          <Route path="ask" element={<ProtectedRoute>
                <AskQuestionPage />
              </ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>} />
        </Route>
        {/* Auth Routes - No Layout */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>;
}