export default {
  setNotes(state, notes) {
    state.notes = notes
  },

  addNote(state, note) {
    state.notes.unshift(note)
  },

  pinNote(state, id) {
    const note = state.notes.find(n => n.id === id)
    note.pinned = !note.pinned
  }
}