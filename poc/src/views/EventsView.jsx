import React, { useState } from 'react'
import Modal from '../components/Modal'
import Avatar from '../components/Avatar'
import { PlusIcon, EditIcon, TrashIcon, CalendarIcon, MusicIcon, SearchIcon, CloseIcon, CheckIcon } from '../components/Icons'

const TODAY = new Date()
TODAY.setHours(0, 0, 0, 0)

function parseDate(str) {
  return new Date(str + 'T12:00:00')
}

function fmtDate(str) {
  const d = parseDate(str)
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function DateChip({ date }) {
  const d = parseDate(date)
  const isPast = d < TODAY
  const day   = d.getDate()
  const month = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
  return (
    <div className={`date-chip${isPast ? ' past' : ''}`} aria-label={fmtDate(date)}>
      <span className="date-chip__day">{day}</span>
      <span className="date-chip__month">{month}</span>
    </div>
  )
}

function AvatarStack({ ids, team }) {
  const MAX = 4
  const visible = ids.slice(0, MAX)
  const extra   = ids.length - MAX
  return (
    <div className="avatar-stack" aria-label={`${ids.length} escalados`}>
      {visible.map(uid => {
        const u = team.find(t => t.id === uid)
        return u ? <Avatar key={uid} src={u.avatar} alt={u.name} size={28} /> : null
      })}
      {extra > 0 && (
        <span className="avatar-stack-more" style={{ width: 28, height: 28, fontSize: 10 }}>
          +{extra}
        </span>
      )}
    </div>
  )
}

function SongsPill({ count }) {
  if (count === 0) return null
  return (
    <span className="songs-pill" aria-label={`${count} música${count !== 1 ? 's' : ''} no setlist`}>
      <MusicIcon />
      {count}
    </span>
  )
}

const EMPTY_FORM = { title: '', date: '', description: '', scale: [], songs: [] }

const TABS = [
  { id: 'upcoming', label: 'Próximos' },
  { id: 'past',     label: 'Passados' },
  { id: 'all',      label: 'Todos' },
]

function uid() { return `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }

export default function EventsView({ events, setEvents, team, setlist }) {
  const [tab, setTab]             = useState('upcoming')
  const [modalOpen, setModal]     = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [deleteId, setDeleteId]   = useState(null)
  const [songSearch, setSongSearch] = useState('')

  // Filter
  const filtered = events.filter(e => {
    const d = parseDate(e.date)
    if (tab === 'upcoming') return d >= TODAY
    if (tab === 'past')     return d < TODAY
    return true
  }).sort((a, b) => parseDate(a.date) - parseDate(b.date))

  const counts = {
    upcoming: events.filter(e => parseDate(e.date) >= TODAY).length,
    past:     events.filter(e => parseDate(e.date) < TODAY).length,
    all:      events.length,
  }

  // Handlers
  const openNew = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setSongSearch('')
    setModal(true)
  }

  const openEdit = (evt) => {
    setEditing(evt)
    setForm({
      title:       evt.title,
      date:        evt.date,
      description: evt.description,
      scale:       [...evt.scale],
      songs:       [...(evt.songs ?? [])],
    })
    setSongSearch('')
    setModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim() || !form.date) return
    if (editing) {
      setEvents(events.map(e => e.id === editing.id ? { ...editing, ...form } : e))
    } else {
      setEvents([...events, { id: uid(), ...form }])
    }
    setModal(false)
  }

  const handleDelete = (id) => {
    setEvents(events.filter(e => e.id !== id))
    setDeleteId(null)
  }

  const toggleMember = (id) => {
    setForm(f => ({
      ...f,
      scale: f.scale.includes(id) ? f.scale.filter(x => x !== id) : [...f.scale, id],
    }))
  }

  const toggleSong = (id) => {
    setForm(f => ({
      ...f,
      songs: f.songs.includes(id) ? f.songs.filter(x => x !== id) : [...f.songs, id],
    }))
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <>
      {/* Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Eventos</h1>
          <p className="view-subtitle">{counts.upcoming} próximo{counts.upcoming !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn" onClick={openNew}>
          <PlusIcon /> Novo Evento
        </button>
      </div>

      {/* Pill Tabs */}
      <div className="view-tabs" role="tablist" aria-label="Filtrar eventos">
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
              <CalendarIcon />
              <p>Nenhum evento {tab === 'upcoming' ? 'futuro' : tab === 'past' ? 'passado' : ''} encontrado.</p>
              <button className="btn btn-sm" onClick={openNew}><PlusIcon /> Criar evento</button>
            </div>
          ) : (
            <div className="event-list">
              {filtered.map(evt => (
                <div key={evt.id} className="event-row">
                  <DateChip date={evt.date} />

                  <div className="event-row__info">
                    <div className="event-row__title">{evt.title}</div>
                    <div className="event-row__desc">{evt.description}</div>
                  </div>

                  <SongsPill count={(evt.songs ?? []).length} />

                  <AvatarStack ids={evt.scale} team={team} />

                  {/* Delete confirm inline */}
                  {deleteId === evt.id ? (
                    <div className="delete-confirm">
                      <strong>Excluir?</strong>
                      <button className="btn btn-sm" style={{ background: '#dc2626' }} onClick={() => handleDelete(evt.id)}>Sim</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setDeleteId(null)}>Não</button>
                    </div>
                  ) : (
                    <div className="event-row__actions">
                      <button className="btn btn-ghost btn-sm" aria-label="Editar evento" onClick={() => openEdit(evt)}>
                        <EditIcon />
                      </button>
                      <button className="btn btn-danger btn-sm" aria-label="Excluir evento" onClick={() => setDeleteId(evt.id)}>
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
        title={editing ? 'Editar Evento' : 'Novo Evento'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn" onClick={handleSave}>Salvar</button>
          </>
        }
      >
        {/* Dados básicos */}
        <div className="field">
          <label className="field-label" htmlFor="evt-title">Título *</label>
          <input id="evt-title" className="field-input" placeholder="Ex: Culto Dominical" value={form.title} onChange={set('title')} />
        </div>

        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="evt-date">Data *</label>
            <input id="evt-date" type="date" className="field-input" value={form.date} onChange={set('date')} />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="evt-desc">Descrição</label>
            <input id="evt-desc" className="field-input" placeholder="Culto das 10h — manhã" value={form.description} onChange={set('description')} />
          </div>
        </div>

        {/* Setlist do dia */}
        <div className="field">
          <label className="field-label">
            Setlist do dia
            {form.songs.length > 0 && (
              <span className="field-label-count">{form.songs.length} selecionada{form.songs.length !== 1 ? 's' : ''}</span>
            )}
          </label>
          {setlist.length === 0 ? (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
              Nenhuma música no setlist. Adicione músicas na aba Setlist primeiro.
            </p>
          ) : (() => {
            const q = songSearch.trim().toLowerCase()
            const sorted = [...setlist].sort((a, b) => {
              const asel = form.songs.includes(a.id)
              const bsel = form.songs.includes(b.id)
              if (asel !== bsel) return asel ? -1 : 1
              return a.title.localeCompare(b.title, 'pt-BR')
            })
            const filtered = q
              ? sorted.filter(s => s.title.toLowerCase().includes(q) || s.author.toLowerCase().includes(q))
              : sorted
            return (
              <div className="song-picker">
                {/* Removable tags for selected songs */}
                {form.songs.length > 0 && (
                  <div className="song-picker__tags" aria-label="Músicas selecionadas">
                    {form.songs.map(id => {
                      const s = setlist.find(x => x.id === id)
                      return s ? (
                        <span key={id} className="song-picker__tag">
                          <span className="song-picker__tag-label">{s.title}</span>
                          <button
                            type="button"
                            className="song-picker__tag-remove"
                            aria-label={`Remover ${s.title}`}
                            onClick={() => toggleSong(id)}
                          >
                            <CloseIcon />
                          </button>
                        </span>
                      ) : null
                    })}
                  </div>
                )}

                {/* Search */}
                <div className="song-picker__search">
                  <span className="song-picker__search-icon" aria-hidden="true"><SearchIcon /></span>
                  <input
                    type="search"
                    placeholder="Buscar música ou artista…"
                    value={songSearch}
                    onChange={e => setSongSearch(e.target.value)}
                    aria-label="Buscar música"
                  />
                </div>

                {/* List */}
                <div className="song-picker__list" role="listbox" aria-multiselectable="true" aria-label="Músicas disponíveis">
                  {filtered.length === 0 ? (
                    <div className="song-picker__empty">Nenhuma música encontrada.</div>
                  ) : filtered.map(song => {
                    const selected = form.songs.includes(song.id)
                    return (
                      <button
                        key={song.id}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={`song-picker__row${selected ? ' selected' : ''}`}
                        onClick={() => toggleSong(song.id)}
                      >
                        <span className="song-picker__check" aria-hidden="true">
                          {selected && <CheckIcon />}
                        </span>
                        <span className="song-picker__row-text">
                          <span className="song-picker__row-title">{song.title}</span>
                          <span className="song-picker__row-author">{song.author}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>

        {/* Escalados */}
        <div className="field">
          <label className="field-label">
            Escalados
            {form.scale.length > 0 && (
              <span className="field-label-count">{form.scale.length} selecionado{form.scale.length !== 1 ? 's' : ''}</span>
            )}
          </label>
          <div className="member-chips">
            {team.map(m => (
              <button
                key={m.id}
                type="button"
                className={`member-chip${form.scale.includes(m.id) ? ' selected' : ''}`}
                onClick={() => toggleMember(m.id)}
                aria-pressed={form.scale.includes(m.id)}
              >
                <Avatar src={m.avatar} alt={m.name} size={22} />
                {m.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}
