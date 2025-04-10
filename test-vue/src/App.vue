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
.notepad-app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.add-note {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.note-title-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.note-content-input {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
}

.add-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.add-button:hover {
  background-color: #45a049;
}

.notes-container {
  margin-top: 20px;
}

.no-notes {
  text-align: center;
  color: #888;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
}

.note-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.note-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border-left: 4px solid #3498db;
}

.note-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
}

.note-item.selected {
  border-left: 4px solid #e74c3c;
  background-color: #f9f9f9;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.note-header h2 {
  margin: 0;
  font-size: 18px;
  word-break: break-word;
}

.note-actions {
  display: flex;
  gap: 5px;
}

.edit-button, .delete-button {
  background-color: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: #f0f0f0;
}

.delete-button {
  color: #e74c3c;
}

.delete-button:hover {
  background-color: #fdedec;
}

.note-content {
  margin-bottom: 15px;
  word-break: break-word;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
}

.note-date {
  font-size: 12px;
  color: #888;
  text-align: right;
}

/* Modal de edição */
.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
}

.save-button, .cancel-button {
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.cancel-button {
  background-color: #f1f1f1;
  border: 1px solid #ddd;
}

/* Responsividade */
@media (max-width: 768px) {
  .note-list {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
  }
}
</style>