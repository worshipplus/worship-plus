import React, { useState } from 'react'
import Modal from '../components/Modal'
import AudioPlayer from '../components/AudioPlayer'
import { PlusIcon, EditIcon, TrashIcon, MusicIcon, SearchIcon, LinkIcon } from '../components/Icons'

const EMPTY_FORM = { title: '', author: '', link: '', media: '' }

function uid() { return `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }

export default function SetlistView({ setlist, setSetlist }) {
  const [search, setSearch]     = useState('')
  const [modalOpen, setModal]   = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState(null)

  const filtered = setlist.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.author.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModal(true)
  }

  const openEdit = (song) => {
    setEditing(song)
    setForm({ title: song.title, author: song.author, link: song.link ?? '', media: song.media ?? '' })
    setModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    const data = { ...form, link: form.link || null, media: form.media || null }
    if (editing) {
      setSetlist(setlist.map(m => m.id === editing.id ? { ...editing, ...data } : m))
    } else {
      setSetlist([...setlist, { id: uid(), ...data }])
    }
    setModal(false)
  }

  const handleDelete = (id) => {
    setSetlist(setlist.filter(m => m.id !== id))
    setDeleteId(null)
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <>
      {/* Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Setlist</h1>
          <p className="view-subtitle">{setlist.length} música{setlist.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--s2)', alignItems: 'center' }}>
          <div className="search-bar">
            <SearchIcon />
            <input
              className="search-input"
              placeholder="Buscar por título ou autor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Buscar músicas"
            />
          </div>
          <button className="btn" onClick={openNew}>
            <PlusIcon /> Adicionar
          </button>
        </div>
      </div>

      {/* List */}
      <div className="view-body">
        <div className="list-card">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <MusicIcon size={32} />
              <p>
                {search
                  ? `Nenhuma música encontrada para "${search}".`
                  : 'Nenhuma música no setlist ainda.'}
              </p>
              {!search && (
                <button className="btn btn-sm" onClick={openNew}><PlusIcon /> Adicionar música</button>
              )}
            </div>
          ) : (
            <div className="song-list">
              {filtered.map(song => (
                <div key={song.id} className="song-row">
                  <div className="song-icon" aria-hidden="true">
                    <MusicIcon size={16} />
                  </div>

                  <div className="song-row__info">
                    <div className="song-row__title">{song.title}</div>
                    <div className="song-row__author">{song.author}</div>
                  </div>

                  {song.media && <AudioPlayer src={song.media} />}

                  {deleteId === song.id ? (
                    <div className="delete-confirm">
                      <strong>Excluir?</strong>
                      <button className="btn btn-sm" style={{ background: '#dc2626' }} onClick={() => handleDelete(song.id)}>Sim</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setDeleteId(null)}>Não</button>
                    </div>
                  ) : (
                    <div className="song-row__actions">
                      {song.link && (
                        <a
                          href={song.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-ghost btn-sm"
                          aria-label="Ver partitura"
                          title="Partitura"
                        >
                          <LinkIcon />
                        </a>
                      )}
                      <button className="btn btn-ghost btn-sm" aria-label="Editar música" onClick={() => openEdit(song)}>
                        <EditIcon />
                      </button>
                      <button className="btn btn-danger btn-sm" aria-label="Excluir música" onClick={() => setDeleteId(song.id)}>
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
        title={editing ? 'Editar Música' : 'Nova Música'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn" onClick={handleSave}>Salvar</button>
          </>
        }
      >
        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="s-title">Título *</label>
            <input id="s-title" className="field-input" placeholder="Ex: Grandioso És Tu" value={form.title} onChange={set('title')} />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="s-author">Autor</label>
            <input id="s-author" className="field-input" placeholder="Ex: Carl Boberg" value={form.author} onChange={set('author')} />
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="s-link">Link da Partitura</label>
          <input id="s-link" type="url" className="field-input" placeholder="https://..." value={form.link} onChange={set('link')} />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="s-media">URL do áudio (VS)</label>
          <input id="s-media" type="url" className="field-input" placeholder="https://... (.mp3 ou .wav)" value={form.media} onChange={set('media')} />
          {form.media && (
            <div style={{ marginTop: 'var(--s2)' }}>
              <AudioPlayer src={form.media} />
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
