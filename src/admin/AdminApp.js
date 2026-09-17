import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import ProfileAdmin from "./pages/ProfileAdmin";
import ProjectsAdmin from "./pages/ProjectsAdmin";
import ExperienceAdmin from "./pages/ExperienceAdmin";
import EducationAdmin from "./pages/EducationAdmin";
import SkillsAdmin from "./pages/SkillsAdmin";
import ServicesAdmin from "./pages/ServicesAdmin";
import CertificationsAdmin from "./pages/CertificationsAdmin";
import ResumeAdmin from "./pages/ResumeAdmin";
import ContactAdmin from "./pages/ContactAdmin";
import SeoAdmin from "./pages/SeoAdmin";
import "./admin.css";

function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        {/* Native password reset recovery route */}
        <Route path="reset-password" element={<ResetPassword />} />

        {/* Protected Admin CMS Routes */}
        <Route
          index
          element={
            <ProtectedRoute title="Dashboard">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute title="Profile & Hero">
              <ProfileAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects"
          element={
            <ProtectedRoute title="Projects">
              <ProjectsAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="experience"
          element={
            <ProtectedRoute title="Experience Timeline">
              <ExperienceAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="education"
          element={
            <ProtectedRoute title="Education & Academics">
              <EducationAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="skills"
          element={
            <ProtectedRoute title="Skills & Tools">
              <SkillsAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="services"
          element={
            <ProtectedRoute title="Services">
              <ServicesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="certifications"
          element={
            <ProtectedRoute title="Certifications">
              <CertificationsAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="resume"
          element={
            <ProtectedRoute title="Resume Management">
              <ResumeAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="contact"
          element={
            <ProtectedRoute title="Contact & Social Links">
              <ContactAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="seo"
          element={
            <ProtectedRoute title="SEO & Metadata">
              <SeoAdmin />
            </ProtectedRoute>
          }
        />

        {/* Fallback to /admin */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default AdminApp;
