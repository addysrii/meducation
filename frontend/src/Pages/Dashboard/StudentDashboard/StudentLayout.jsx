import StudentDashboard from "./StudentDashboard";
import AIAssistant from "../../Components/AIAssistant/AIAssistant";
import PomodoroTimer from "../../Components/Pomodoro/PomodoroTimer";

// StudentDashboard now contains <Outlet /> internally,
// so StudentLayout just renders StudentDashboard.
export default function StudentLayout() {
  return (
    <>
      <StudentDashboard />
      <AIAssistant />
      <PomodoroTimer />
    </>
  );
}