import React, { useState, lazy, Suspense } from 'react'
import Sidebar from './components/Sidebar'
import { TEAM as TEAM_DATA, EVENTS as EVENTS_DATA, SETLIST as SETLIST_DATA } from './mock/data'

const EventsView  = lazy(() => import('./views/EventsView'))
const TeamView    = lazy(() => import('./views/TeamView'))
const SetlistView = lazy(() => import('./views/SetlistView'))

export default function App() {
  const [view, setView] = useState('events')

  // Lift state so EventsView can read team data for avatar stacks / member selection
  const [team, setTeam]       = useState(TEAM_DATA)
  const [events, setEvents]   = useState(EVENTS_DATA)
  const [setlist, setSetlist] = useState(SETLIST_DATA)

  return (
    <div className="app-layout">
      <Sidebar active={view} onNavigate={setView} />
      <main className="main-content">
        <Suspense fallback={null}>
          {view === 'events'  && <EventsView events={events} setEvents={setEvents} team={team} setlist={setlist} />}
          {view === 'team'    && <TeamView team={team} setTeam={setTeam} />}
          {view === 'setlist' && <SetlistView setlist={setlist} setSetlist={setSetlist} />}
        </Suspense>
      </main>
    </div>
  )
}
