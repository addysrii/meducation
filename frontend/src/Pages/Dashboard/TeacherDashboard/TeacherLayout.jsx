import React from 'react'
import TeacherDashboard from './TeacherDashboard'
import AIAssistant from '../../Components/AIAssistant/AIAssistant'
import PomodoroTimer from '../../Components/Pomodoro/PomodoroTimer'

function TeacherLayout() {
  return (
    <>
      <TeacherDashboard/>
      <AIAssistant />
      <PomodoroTimer />
    </>
  )
}

export default TeacherLayout