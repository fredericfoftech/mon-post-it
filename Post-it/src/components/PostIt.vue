<template>
  <div class="container">
    <h1>Mes Post-it</h1>

    <div class="form">
      <input v-model="title" placeholder="Titre" />
      <textarea v-model="description" placeholder="Description"></textarea>
      <button @click="addNote">Ajouter</button>
    </div>

    <div v-if="loading" class="info">Chargement...</div>
    <div v-else-if="error" class="info error">{{ error }}</div>

    <div class="notes">
      <transition-group name="fade">
        <div class="note" v-for="(note, index) in notes" :key="note.id || note._id">
          <h3>{{ note.title }}</h3>
          <p>{{ note.description || note.content }}</p>

          <div class="actions">
            <button @click="pinNote(index)">Épingler</button>
            <button @click="editNote(index)">Modifier</button>
            <button @click="deleteNote(index)">Supprimer</button>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const notes = ref([]);
const loading = ref(true);
const error = ref('');

const title = ref('');
const description = ref('');

const fetchNotes = async () => {
  loading.value = true;
  try {
    const response = await axios.get('https://postit.zoul.dev/notes');
    const apiNotes = response.data.notes.map(n => ({
      id: n._id,
      title: n.title,
      description: n.content.join(' ')
    }));
    notes.value = apiNotes;
  } catch (err) {
    error.value = err.message || 'Une erreur est survenue';
  } finally {
    loading.value = false;
  }
};


onMounted(() => {
  fetchNotes();
});


const addNote = async () => {
await axios.post('https://postit.zoul.dev/notes', {
  title: title.value,
  content: [description.value]
}).then((response_data) => {
  console.log(response_data);
  fetchNotes();
  title.value = '';
  description.value = '';
}, (error) => {
  console.log(error);
});

  console.log(title.value, description.value);
};

const deleteNote = async (index) => {
  const note = notes.value[index];

  try {
    await axios.delete(`https://postit.zoul.dev/notes/${note.id}`);

    notes.value.splice(index, 1);

  } catch (error) {
    console.log(error);
  }
};


const editNote = index => {
  title.value = notes.value[index].title;
  description.value = notes.value[index].description;
  notes.value.splice(index, 1);
};

const pinNote = index => {
  const pinned = notes.value.splice(index, 1)[0];
  notes.value.unshift(pinned);
};
</script>

<style>
.container {
  padding: 30px;
  font-family: Arial;
  background: #f4f4f4;
  min-height: 100vh;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

p {
 word-break: break-word;
 overflow-wrap: break-word;
}

.form {
  margin-bottom: 30px;
}
input, textarea {
  display: block;
  width: 300px;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
button {
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #3498db;
  color: white;
  font-weight: bold;
}
button:hover {
  opacity: 0.9;
}

.notes {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.note {
  background: #fff9a8;
  width: 220px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 4px 4px 10px rgba(0,0,0,0.2);
  transform: rotate(-2deg);
  transition: 0.3s;
}


.note:hover {
  transform: scale(1.05);
}

.actions {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  gap: 5px;
}

.actions button {
  padding: 5px 8px;
  font-size: 0.85rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
  transition: 0.2s;
}

.actions button:nth-child(1) { background-color: #f39c12; }
.actions button:nth-child(2) { background-color: #3498db; }
.actions button:nth-child(3) { background-color: #e74c3c; } 

.actions button:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

.fade-enter-active {
  transition: all 0.5s;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.info {
  text-align: center;
  font-size: 16px;
  margin-bottom: 20px;
}
.info.error { color: red; }
</style>