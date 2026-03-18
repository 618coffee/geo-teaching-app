import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './layouts/AppShell';
import { HomePage } from './pages/Home';
import { StudentTasksPage } from './pages/student/StudentTasks';
import { StudentDecisionPage } from './pages/student/StudentDecision';
import { StudentReportPage } from './pages/student/StudentReport';
import { StudentComparePage } from './pages/student/StudentCompare';
import { StudentReversePage } from './pages/student/StudentReverse';
import { TeacherTasksPage } from './pages/teacher/TeacherTasks';
import { TeacherCreatePage } from './pages/teacher/TeacherCreate';
import { TeacherReviewPage } from './pages/teacher/TeacherReview';
import { TeacherAnalysisPage } from './pages/teacher/TeacherAnalysis';
import { TeacherDemoPage } from './pages/teacher/TeacherDemo';
import { AdminModulesPage } from './pages/admin/AdminModules';
import { AdminUsersPage } from './pages/admin/AdminUsers';
import { AdminPromptsPage } from './pages/admin/AdminPrompts';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<HomePage />} />

        <Route path="student">
          <Route index element={<Navigate to="tasks" replace />} />
          <Route path="tasks" element={<StudentTasksPage />} />
          <Route path="decision" element={<StudentDecisionPage />} />
          <Route path="report" element={<StudentReportPage />} />
          <Route path="compare" element={<StudentComparePage />} />
          <Route path="reverse" element={<StudentReversePage />} />
        </Route>

        <Route path="teacher">
          <Route index element={<Navigate to="tasks" replace />} />
          <Route path="tasks" element={<TeacherTasksPage />} />
          <Route path="create" element={<TeacherCreatePage />} />
          <Route path="review" element={<TeacherReviewPage />} />
          <Route path="analysis" element={<TeacherAnalysisPage />} />
          <Route path="demo" element={<TeacherDemoPage />} />
        </Route>

        <Route path="admin">
          <Route index element={<Navigate to="modules" replace />} />
          <Route path="modules" element={<AdminModulesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="prompts" element={<AdminPromptsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
