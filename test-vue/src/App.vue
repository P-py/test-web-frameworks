// App.vue - Componente principal do aplicativo
<template>
  <div class="notepad-app">
    <h1>Bloco de Notas</h1>
    <div class="add-note">
      <input 
        v-model="newNoteTitle" 
        placeholder="Título da nota" 
        class="note-title-input"
      />
      <textarea 
        v-model="newNoteContent" 
        placeholder="Conteúdo da nota" 
        class="note-content-input"
      ></textarea>
      <button @click="addNote" class="add-button">Adicionar Nota</button>
    </div>
    
    <div class="notes-container">
      <div v-if="notes.length === 0" class="no-notes">
        Nenhuma nota ainda. Adicione uma nova nota!
      </div>
      <div v-else class="note-list">
        <div 
          v-for="(note, index) in notes" 
          :key="index" 
          class="note-item"
          :class="{ 'selected': selectedNoteIndex === index }"
          @click="selectNote(index)"
        >
          <div class="note-header">
            <h2>{{ note.title || 'Sem título' }}</h2>
            <div class="note-actions">
              <button @click.stop="editNote(index)" class="edit-button">Editar</button>
              <button @click.stop="deleteNote(index)" class="delete-button">Excluir</button>
            </div>
          </div>
          <div class="note-content">{{ note.content }}</div>
          <div class="note-date">{{ formatDate(note.date) }}</div>
        </div>
      </div>
    </div>
    
    <!-- Modal de edição -->
    <div v-if="showEditModal" class="edit-modal">
      <div class="modal-content">
        <h2>Editar Nota</h2>
        <input v-model="editingNote.title" placeholder="Título da nota" class="note-title-input" />
        <textarea v-model="editingNote.content" placeholder="Conteúdo da nota" class="note-content-input"></textarea>
        <div class="modal-actions">
          <button @click="saveEditedNote" class="save-button">Salvar</button>
          <button @click="cancelEdit" class="cancel-button">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotepadApp',
  data() {
    return {
      notes: [],
      newNoteTitle: '',
      newNoteContent: '',
      selectedNoteIndex: -1,
      showEditModal: false,
      editingNote: {
        index: -1,
        title: '',
        content: '',
        date: null
      }
    };
  },
  created() {
    // Carregar notas do localStorage quando o componente é criado
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    }
  },
  methods: {
    addNote() {
      if (this.newNoteContent.trim() !== '') {
        const newNote = {
          title: this.newNoteTitle.trim() || 'Sem título',
          content: this.newNoteContent.trim(),
          date: new Date()
        };
        
        this.notes.unshift(newNote); // Adiciona no início da lista
        this.saveNotes();
        
        // Limpar os campos
        this.newNoteTitle = '';
        this.newNoteContent = '';
      }
    },
    selectNote(index) {
      this.selectedNoteIndex = index;
    },
    editNote(index) {
      this.editingNote = {
        index: index,
        title: this.notes[index].title,
        content: this.notes[index].content,
        date: this.notes[index].date
      };
      this.showEditModal = true;
    },
    saveEditedNote() {
      if (this.editingNote.content.trim() !== '') {
        const updatedNote = {
          title: this.editingNote.title.trim() || 'Sem título',
          content: this.editingNote.content.trim(),
          date: new Date() // Atualiza a data
        };
        
        this.notes[this.editingNote.index] = updatedNote;
        this.saveNotes();
        this.showEditModal = false;
      }
    },
    cancelEdit() {
      this.showEditModal = false;
    },
    deleteNote(index) {
      if (confirm('Tem certeza que deseja excluir esta nota?')) {
        this.notes.splice(index, 1);
        this.saveNotes();
        
        if (this.selectedNoteIndex === index) {
          this.selectedNoteIndex = -1;
        } else if (this.selectedNoteIndex > index) {
          this.selectedNoteIndex--;
        }
      }
    },
    saveNotes() {
      localStorage.setItem('notes', JSON.stringify(this.notes));
    },
    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleString('pt-BR');
    }
  }
};
</script>

<style>
body {
  background-color: #1e1e2e;
  color: #cdd6f4;
  margin: 0;
  padding: 0;
}

.notepad-app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

h1 {
  text-align: center;
  color: #cba6f7;
  margin-bottom: 30px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.add-note {
  background-color: #313244;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.note-title-input {
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #585b70;
  border-radius: 4px;
  font-size: 16px;
  background-color: #1e1e2e;
  color: #cdd6f4;
}

.note-content-input {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  margin-bottom: 12px;
  border: 1px solid #585b70;
  border-radius: 4px;
  font-size: 16px;
  background-color: #1e1e2e;
  color: #cdd6f4;
  resize: vertical;
}

.add-button {
  background-color: #a6e3a1;
  color: #11111b;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #94e2d5;
}

.notes-container {
  margin-top: 20px;
}

.no-notes {
  text-align: center;
  color: #bac2de;
  padding: 30px;
  background-color: #313244;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.note-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.note-item {
  background-color: #313244;
  border-radius: 8px;
  padding: 18px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border-left: 4px solid #89b4fa;
}

.note-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.note-item.selected {
  border-left: 4px solid #f38ba8;
  background-color: #45475a;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  border-bottom: 1px solid #45475a;
  padding-bottom: 12px;
}

.note-header h2 {
  margin: 0;
  font-size: 18px;
  color: #cba6f7;
  word-break: break-word;
}

.note-actions {
  display: flex;
  gap: 8px;
}

.edit-button, .delete-button {
  background-color: #45475a;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
  color: #cdd6f4;
}

.edit-button:hover {
  background-color: #585b70;
}

.delete-button {
  color: #f38ba8;
}

.delete-button:hover {
  background-color: #45475a;
}

.note-content {
  margin-bottom: 15px;
  word-break: break-word;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
  color: #cdd6f4;
}

.note-date {
  font-size: 12px;
  color: #a6adc8;
  text-align: right;
}

/* Modal de edição */
.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(17, 17, 27, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #313244;
  padding: 25px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
}

.modal-content h2 {
  color: #cba6f7;
  margin-top: 0;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 12px;
}

.save-button, .cancel-button {
  padding: 10px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.save-button {
  background-color: #a6e3a1;
  color: #11111b;
  border: none;
}

.save-button:hover {
  background-color: #94e2d5;
}

.cancel-button {
  background-color: #45475a;
  border: none;
  color: #cdd6f4;
}

.cancel-button:hover {
  background-color: #585b70;
}

/* Configurações para scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1e1e2e;
}

::-webkit-scrollbar-thumb {
  background: #45475a;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #585b70;
}

/* Responsividade */
@media (max-width: 768px) {
  .note-list {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    padding: 15px;
  }
}

/* Estilo para os placeholders */
::placeholder {
  color: #7f849c;
  opacity: 1;
}
</style>