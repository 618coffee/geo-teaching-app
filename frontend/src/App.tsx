import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { getDefaultRouteForRole, useAuth, type UserRole } from './auth/AuthContext';
import { AppShell } from './layouts/AppShell';
import { HomePage } from './pages/Home';
import { StudentTasksPage } from './pages/student/StudentTasks';
import { StudentDecisionPage } from './pages/student/StudentDecision';
import { StudentReportPage } from './pages/student/StudentReport';
import { StudentComparePage } from './pages/student/StudentCompare';
import { StudentReversePage } from './pages/student/StudentReverse';
import { StudentProfilePage } from './pages/student/StudentProfile';
import { TeacherTasksPage } from './pages/teacher/TeacherTasks';
import { TeacherCreatePage } from './pages/teacher/TeacherCreate';
import { TeacherReviewPage } from './pages/teacher/TeacherReview';
import { TeacherAnalysisPage } from './pages/teacher/TeacherAnalysis';
import { TeacherDemoPage } from './pages/teacher/TeacherDemo';
import { TeacherSchoolsPage } from './pages/teacher/TeacherSchools';
import { TeacherClassesPage } from './pages/teacher/TeacherClasses';
import { TeacherStudentsPage } from './pages/teacher/TeacherStudents';
import { TeacherCasesPage } from './pages/teacher/TeacherCases';
import { TeacherKnowledgePage } from './pages/teacher/TeacherKnowledge';
import { TeacherDemosPage } from './pages/teacher/TeacherDemos';
import { TeacherProfilePage } from './pages/teacher/TeacherProfile';
import { AdminDashboardPage } from './pages/admin/AdminDashboard';
import { AdminInsightsPage } from './pages/admin/AdminInsights';
import { AdminKnowledgePage } from './pages/admin/AdminKnowledge';
import { AdminModulesPage } from './pages/admin/AdminModules';
import { AdminSettingsPage } from './pages/admin/AdminSettings';
import { AdminUsersPage } from './pages/admin/AdminUsers';
import { AdminPromptsPage } from './pages/admin/AdminPrompts';

function RoleSectionGate({ role }: { role: UserRole }) {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) {
    const redirectTarget = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/?redirect=${encodeURIComponent(redirectTarget)}`} replace />;
  }

  if (user.role !== role) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<HomePage />} />

        <Route path="student" element={<RoleSectionGate role="student" />}>
          <Route index element={<Navigate to="tasks" replace />} />
          <Route path="tasks" element={<StudentTasksPage />} />
          <Route path="decision" element={<StudentDecisionPage />} />
          <Route path="report" element={<StudentReportPage />} />
          <Route path="compare" element={<StudentComparePage />} />
          <Route path="reverse" element={<StudentReversePage />} />
          <Route path="profile" element={<StudentProfilePage />} />
        </Route>

        <Route path="teacher" element={<RoleSectionGate role="teacher" />}>
          <Route index element={<Navigate to="tasks" replace />} />
          <Route path="tasks" element={<TeacherTasksPage />} />
          <Route path="create" element={<TeacherCreatePage />} />
          <Route path="review" element={<TeacherReviewPage />} />
          <Route path="analysis" element={<TeacherAnalysisPage />} />
          <Route path="demo" element={<TeacherDemoPage />} />
          <Route path="schools" element={<TeacherSchoolsPage />} />
          <Route path="classes" element={<TeacherClassesPage />} />
          <Route path="students" element={<TeacherStudentsPage />} />
          <Route path="cases" element={<TeacherCasesPage />} />
          <Route path="knowledge" element={<TeacherKnowledgePage />} />
          <Route path="demos" element={<TeacherDemosPage />} />
          <Route path="profile" element={<TeacherProfilePage />} />
        </Route>

        <Route path="admin" element={<RoleSectionGate role="admin" />}>
          <Route index element={<Navigate to="modules" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="modules" element={<AdminModulesPage />} />
          <Route path="knowledge" element={<AdminKnowledgePage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="prompts" element={<AdminPromptsPage />} />
          <Route path="insights" element={<AdminInsightsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
