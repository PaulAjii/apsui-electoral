<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <!-- <div class="action__btns">
      <button class="action__btn edit">
        <v-icon name="FaEdit" />
        dlfldfdfl
      </button> -->
    <!-- </div> -->
    <div class="modal-content">
      <h2>Add a New Candidate</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="formData.name" placeholder="John Doe" required />
        </div>

        <div class="form-group">
          <label for="studentID">Student ID</label>
          <input
            type="text"
            id="studentID"
            v-model="formData.studentId"
            placeholder="234612"
            required
          />
        </div>

        <div class="form-group">
          <label for="alias">Alias</label>
          <input type="text" id="alias" v-model="formData.alias" placeholder="johnny" />
        </div>

        <div class="form-group">
          <label for="position">Position</label>
          <input
            type="text"
            id="position"
            v-model="formData.position"
            placeholder="Social Director"
            required
          />
        </div>

        <div class="form-group">
          <label for="level">Level</label>
          <select name="level" id="level" v-model="formData.level" required>
            <option value="" selected>Select Level</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
          </select>
        </div>

        <div class="form-group">
          <label for="gender">Gender</label>
          <select name="gender" id="gender" v-model="formData.gender" required>
            <option value="" selected>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div class="form-group">
          <label for="catchPhrase">Catch Phrase</label>
          <textarea
            id="catchPhrase"
            v-model="formData.catchPhrase"
            placeholder="lorem ipsum..."
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit__btn">Add Candidate</button>
          <button type="button" @click="$emit('close')" class="cancel__btn">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'submit'])

const formData = ref({
  name: '',
  alias: '',
  position: '',
  level: '',
  catchPhrase: '',
  gender: '',
  studentId: '',
})

const handleSubmit = () => {
  emit('submit', formData.value)
  formData.value = {
    name: '',
    alias: '',
    position: '',
    level: '',
    catchPhrase: '',
    gender: '',
    studentId: '',
  }
}
</script>

<style scoped>
h2 {
  margin-bottom: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.form-group {
  margin-bottom: 0.5rem;
}

label {
  display: block;
  font-weight: bold;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: rgb(256, 256, 256);
  color: rgb(58, 58, 58);
  outline: none;
  font-weight: 500;
  font-size: 1rem;
}

textarea {
  resize: none;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}

.submit__btn {
  background: #4caf50;
  color: white;
}

.cancel__btn {
  background: #f44336;
  color: white;
}
</style>
