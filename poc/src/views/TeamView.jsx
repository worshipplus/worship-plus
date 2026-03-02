import React, { useState } from 'react'
import Modal from '../components/Modal'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import { PlusIcon, EditIcon, TrashIcon, UsersIcon } from '../components/Icons'

const ROLES = [
  { value: 'cantor', label: 'Cantor' },
  { value: 'musico', label: 'Músico' },
  { value: 'midia',  label: 'Mídia' },
  { value: 'som',    label: 'Som' },
]

const TABS = [
  { id: 'all',    label: 'Todos' },
  { id: 'cantor', label: 'Cantores' },
  { id: 'musico', label: 'Músicos' },
  { id: 'midia',  label: 'Mídia' },
  { id: 'som',    label: 'Som' },
]

const EMPTY_FORM = { name: '', email: '', instrument: '', role: 'musico', congregation: '' }

function uid() { return `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }

export default function TeamView({ team, setTeam }) {
  const [tab, setTab]           = useState('all')
  const [modalOpen, setModal]   = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState(null)

  const filtered = tab === 'all' ? team : team.filter(m => m.role === tab)

  const counts = Object.fromEntries(
    TABS.map(t => [t.id, t.id === 'all' ? team.length : team.filter(m => m.role === t.id).length])
  )

  const openNew = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModal(true)
  }

  const openEdit = (member) => {
    setEditing(member)
    setForm({ name: member.name, email: member.email, instrument: member.instrument, role: member.role, congregation: member.congregation })
    setModal(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editing) {
      setTeam(team.map(m => m.id === editing.id ? { ...editing, ...form } : m))
    } else {
      setTeam([...team, { id: uid(), avatar: null, ...form }])
    }
    setModal(false)
  }

  const handleDelete = (id) => {
    setTeam(team.filter(m => m.id !== id))
    setDeleteId(null)
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <>
      {/* Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Equipe</h1>
          <p className="view-subtitle">{team.length} integrante{team.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn" onClick={openNew}>
          <PlusIcon /> Adicionar Integrante
        </button>
      </div>

      {/* Pill Tabs */}
      <div className="view-tabs" role="tablist" aria-label="Filtrar por função">
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`view-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            <span className="view-tab-count">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="view-body">
        <div className="list-card">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <UsersIcon />
              <p>Nenhum integrante nessa função ainda.</p>
              <button className="btn btn-sm" onClick={openNew}><PlusIcon /> Adicionar</button>
            </div>
          ) : (
            <div className="member-list">
              {filtered.map(member => (
                <div key={member.id} className="member-row">
                  <Avatar src={member.avatar} alt={member.name} size={40} />

                  <div className="member-row__info">
                    <div className="member-row__name">{member.name}</div>
                    <div className="member-row__meta">
                      {member.instrument}
                      {member.congregation && ` · ${member.congregation}`}
                      {member.email && ` · ${member.email}`}
                    </div>
                  </div>

                  <Badge role={member.role} />

                  {deleteId === member.id ? (
                    <div className="delete-confirm">
                      <strong>Excluir?</strong>
                      <button className="btn btn-sm" style={{ background: '#dc2626' }} onClick={() => handleDelete(member.id)}>Sim</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setDeleteId(null)}>Não</button>
                    </div>
                  ) : (
                    <div className="member-row__actions">
                      <button className="btn btn-ghost btn-sm" aria-label="Editar integrante" onClick={() => openEdit(member)}>
                        <EditIcon />
                      </button>
                      <button className="btn btn-danger btn-sm" aria-label="Excluir integrante" onClick={() => setDeleteId(member.id)}>
                        <TrashIcon />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModal(false)}
        title={editing ? 'Editar Integrante' : 'Novo Integrante'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn" onClick={handleSave}>Salvar</button>
          </>
        }
      >
        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="m-name">Nome *</label>
            <input id="m-name" className="field-input" placeholder="Nome completo" value={form.name} onChange={set('name')} />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="m-email">E-mail</label>
            <input id="m-email" type="email" className="field-input" placeholder="nome@email.com" value={form.email} onChange={set('email')} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="m-instrument">Instrumento / Função</label>
            <input id="m-instrument" className="field-input" placeholder="Ex: Violão, Voz, Teclado..." value={form.instrument} onChange={set('instrument')} />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="m-role">Área *</label>
            <select id="m-role" className="field-select" value={form.role} onChange={set('role')}>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="m-congregation">Congregação</label>
          <input id="m-congregation" className="field-input" placeholder="Ex: AD Central" value={form.congregation} onChange={set('congregation')} />
        </div>
      </Modal>
    </>
  )
}
