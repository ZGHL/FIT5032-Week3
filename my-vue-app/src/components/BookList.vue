<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue'
import { collection, query, where, orderBy, limit, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import db from '../firebase/init.js';

const emit = defineEmits(['bookUpdated', 'bookDeleted']);

const books = ref<Array<{ id: string; ISBN: string; name: string }>>([]);
const editingBook = ref<{ id: string; ISBN: string; name: string } | null>(null);
const editISBN = ref('');
const editName = ref('');

const fetchBooks = async () => {
  try {
    // Query with where, orderBy, and limit as required
    const q = query(
      collection(db, "books"), 
      where("ISBN", ">", "1000"),
      orderBy("name", "asc"),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    books.value = [];
    querySnapshot.forEach((doc) => {
      books.value.push({ id: doc.id, ...(doc.data() as { ISBN: string; name: string }) });
    });
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};

onMounted(() => {
  fetchBooks();
});

const startEdit = (book: { id: string; ISBN: string; name: string }) => {
  editingBook.value = { ...book };
  editISBN.value = book.ISBN;
  editName.value = book.name;
};

const saveEdit = async () => {
  if (!editingBook.value) return;
  
  try {
    const bookRef = doc(db, "books", editingBook.value.id);
    await updateDoc(bookRef, {
      ISBN: editISBN.value,
      name: editName.value
    });
    
    await fetchBooks(); // Refresh the list
    editingBook.value = null;
    emit('bookUpdated');
  } catch (error) {
    console.error("Error updating book:", error);
    alert("Error updating book: " + error.message);
  }
};

const cancelEdit = () => {
  editingBook.value = null;
  editISBN.value = '';
  editName.value = '';
};

const deleteBook = async (bookId: string) => {
  if (!confirm('Are you sure you want to delete this book?')) return;
  
  try {
    await deleteDoc(doc(db, "books", bookId));
    await fetchBooks(); // Refresh the list
    emit('bookDeleted');
  } catch (error) {
    console.error("Error deleting book:", error);
    alert("Error deleting book: " + error.message);
  }
};

// Expose fetchBooks for parent component to call when new book is added
defineExpose({ fetchBooks });
</script>

<template>
<div class="book-list">
  <h3>Books List (ISBN > 1000)</h3>
  <div class="books-container">
    <div v-if="books.length === 0" class="empty-state">
      <p>No books found</p>
    </div>
    <div v-else>
      <div 
        v-for="book in books" 
        :key="book.id" 
        class="book-item"
      >
        <div v-if="editingBook?.id === book.id" class="edit-form">
          <input 
            v-model="editName" 
            placeholder="Book Name" 
            class="edit-input"
          />
          <input 
            v-model="editISBN" 
            placeholder="ISBN" 
            class="edit-input"
          />
          <div class="edit-actions">
            <button @click="saveEdit" class="save-btn">Save</button>
            <button @click="cancelEdit" class="cancel-btn">Cancel</button>
          </div>
        </div>
        <div v-else class="book-content">
          <div class="book-info">
            <h4>{{ book.name }}</h4>
            <p class="isbn">ISBN: {{ book.ISBN }}</p>
          </div>
          <div class="book-actions">
            <button @click="startEdit(book)" class="edit-btn">Edit</button>
            <button @click="deleteBook(book.id)" class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.book-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.books-container {
  flex: 1;
  overflow-y: auto;
  max-height: 500px;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.book-item {
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  padding: 1rem;
  transition: all 0.3s ease;
}

.book-item:hover {
  border-color: #4285f4;
  box-shadow: 0 2px 8px rgba(66, 133, 244, 0.1);
}

.book-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-info h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
}

.book-info .isbn {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.book-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-input {
  padding: 8px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.edit-input:focus {
  outline: none;
  border-color: #4285f4;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .save-btn {
  padding: 6px 12px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-btn:hover, .save-btn:hover {
  background: #3367d6;
}

.delete-btn, .cancel-btn {
  padding: 6px 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-btn:hover, .cancel-btn:hover {
  background: #c82333;
}
</style>