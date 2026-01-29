import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit3, Save, X, Search, Pin, PinOff } from 'lucide-react'

interface Note {
  id: number
  title: string
  content: string
  pinned: boolean
  created_at: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -100, transition: { duration: 0.2 } },
}

export function NotesApp(): React.JSX.Element {
  const [notes, setNotes] = React.useState<Note[]>([])
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [editTitle, setEditTitle] = React.useState('')
  const [editContent, setEditContent] = React.useState('')

  const API_BASE = `/api`

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState('')

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch notes (with optional search)
  const fetchNotes = React.useCallback(async () => {
    try {
      const url = debouncedSearch
        ? `${API_BASE}/notes?q=${encodeURIComponent(debouncedSearch)}`
        : `${API_BASE}/notes`
      const res = await fetch(url)
      const data: Note[] = await res.json()
      setNotes(data)
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    }
  }, [API_BASE, debouncedSearch])

  React.useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  // Create note
  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return
    try {
      await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
      setTitle('')
      setContent('')
      fetchNotes()
    } catch (err) {
      console.error('Failed to create note:', err)
    }
  }

  // Update note
  const handleUpdate = async (id: number) => {
    try {
      await fetch(`${API_BASE}/notes/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: editTitle, content: editContent }),
      })
      setEditingId(null)
      fetchNotes()
    } catch (err) {
      console.error('Failed to update note:', err)
    }
  }

  // Toggle pin
  const handleTogglePin = async (id: number) => {
    try {
      await fetch(`${API_BASE}/notes/pin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      fetchNotes()
    } catch (err) {
      console.error('Failed to toggle pin:', err)
    }
  }

  // Delete note
  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_BASE}/notes/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      fetchNotes()
    } catch (err) {
      console.error('Failed to delete note:', err)
    }
  }

  const startEditing = (note: Note) => {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-4">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white/80 py-3 pl-12 pr-4 shadow-sm backdrop-blur-sm transition-shadow focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
        {debouncedSearch && (
          <p className="mt-2 text-sm text-gray-500">
            Found {notes.length} result{notes.length !== 1 ? 's' : ''} for "
            {debouncedSearch}"
          </p>
        )}
      </motion.div>

      {/* Create Note Form */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-xl border border-gray-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm"
      >
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Create New Note
        </h2>
        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-3 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        />
        <textarea
          placeholder="Write your note content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mb-4 w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-2 font-medium text-white shadow-md transition-shadow hover:shadow-lg"
        >
          <Plus size={18} />
          Add Note
        </motion.button>
      </motion.div>

      {/* Notes List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              variants={itemVariants}
              exit="exit"
              layout
              className={`rounded-xl border p-5 shadow-md backdrop-blur-sm ${
                note.pinned
                  ? 'border-amber-300 bg-amber-50/80'
                  : 'border-gray-200 bg-white/80'
              }`}
            >
              {editingId === note.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(note.id)}
                      className="flex items-center gap-1 rounded-lg bg-teal-500 px-4 py-2 text-sm text-white hover:bg-teal-600"
                    >
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 rounded-lg bg-gray-400 px-4 py-2 text-sm text-white hover:bg-gray-500"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {note.pinned && (
                        <span className="text-amber-500">📌</span>
                      )}
                      <h3 className="text-lg font-semibold text-gray-800">
                        {note.title}
                      </h3>
                    </div>
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleTogglePin(note.id)}
                        className={`rounded-lg p-2 transition-colors ${
                          note.pinned
                            ? 'text-amber-500 hover:bg-amber-100'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-amber-500'
                        }`}
                        title={note.pinned ? 'Unpin' : 'Pin'}
                      >
                        {note.pinned ? <PinOff size={18} /> : <Pin size={18} />}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => startEditing(note)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-teal-600"
                      >
                        <Edit3 size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(note.id)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap text-gray-600">
                    {note.content}
                  </p>
                  <p className="mt-3 text-xs text-gray-400">
                    {new Date(note.created_at * 1000).toLocaleString()}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {notes.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500"
        >
          {debouncedSearch
            ? `No notes found for "${debouncedSearch}"`
            : 'No notes yet. Create your first one above! ✨'}
        </motion.p>
      )}
    </div>
  )
}
