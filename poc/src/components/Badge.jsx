import React from 'react'

const LABELS = {
  cantor: 'Cantor',
  musico: 'Músico',
  midia:  'Mídia',
  som:    'Som',
  admin:  'Admin',
}

export default function Badge({ role }) {
  return (
    <span className={`badge badge-${role}`}>
      {LABELS[role] ?? role}
    </span>
  )
}
