import StudentDashboard from "./StudentDashboard";

// StudentDashboard now contains <Outlet /> internally,
// so StudentLayout just renders StudentDashboard.
export default function StudentLayout() {
  return <StudentDashboard />;
}