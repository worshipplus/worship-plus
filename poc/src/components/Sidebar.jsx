import React from 'react'
import { CalendarIcon, UsersIcon, MusicIcon } from './Icons'

const NAV = [
  { id: 'events',     label: 'Eventos',    Icon: CalendarIcon },
  { id: 'team',       label: 'Equipe',     Icon: UsersIcon },
  { id: 'setlist', label: 'Setlist', Icon: MusicIcon },
]

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-logo">W+</span>
        <span className="sidebar-brand-name">Worship+</span>
      </div>

      <nav className="sidebar-nav" aria-label="Navegação principal">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`sidebar-nav-item${active === id ? ' active' : ''}`}
            onClick={() => onNavigate(id)}
            aria-current={active === id ? 'page' : undefined}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">PoC — não é versão final</div>
    </aside>
  )
}
