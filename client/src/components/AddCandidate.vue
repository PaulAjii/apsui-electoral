<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Add a New Candidate</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form__container">
          <div class="form__group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="formData.name" placeholder="John Doe" required />
          </div>

          <div class="form__group">
            <label for="studentID">Matric No.</label>
            <input
              type="text"
              id="studentID"
              v-model="formData.studentId"
              placeholder="234612"
              required
            />
          </div>

          <div class="form__group">
            <label for="alias">Alias</label>
            <input type="text" id="alias" v-model="formData.alias" placeholder="johnny" />
          </div>

          <div class="form__group">
            <label for="position">Position</label>
            <input
              type="text"
              id="position"
              v-model="formData.position"
              placeholder="Social Director"
              required
            />
          </div>

          <div class="form__group">
            <label for="level">Level</label>
            <select name="level" id="level" v-model="formData.level" required>
              <option value="" selected>Select Level</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
            </select>
          </div>

          <div class="form__group">
            <label for="gender">Gender</label>
            <select name="gender" id="gender" v-model="formData.gender" required>
              <option value="" selected>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div class="form__group">
            <label for="catchPhrase">Catchphrase</label>
            <textarea
              id="catchPhrase"
              v-model="formData.catchPhrase"
              placeholder="lorem ipsum..."
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit__btn" :disabled="loading === true">
            {{ loading === true ? 'Adding Candidate...' : 'Add Candidate' }}
          </button>
          <button type="button" @click="$emit('close')" class="cancel__btn">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close', 'submit']);
const loading = defineProps({
  type: Boolean,
  required: true
});

const formData = ref({
  name: '',
  alias: '',
  position: '',
  level: '',
  catchPhrase: '',
  gender: '',
  studentId: ''
});

const handleSubmit = () => {
  emit('submit', formData.value);
  formData.value = {
    name: '',
    alias: '',
    position: '',
    level: '',
    catchPhrase: '',
    gender: '',
    studentId: ''
  };
};
</script>

<style scoped>
h2 {
  font-size: 1rem;
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
  padding: 1rem;
  width: 90%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.form-group {
  margin-bottom: 0.5rem;
}

select {
  padding-inline: 0;
}

input,
textarea,
select {
  background-color: rgb(256, 256, 256);
  outline: none;
  border: none;
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

.form__container {
  width: 100%;
  max-width: 600px;
  padding: 1.5rem 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form__group {
  display: flex;
  border: 2px solid rgb(17, 17, 17);
  border-radius: 0.25rem;
  font-size: 1rem;
}

.form__group > * {
  font-size: 0.75rem;
  font-weight: 500;
}

.form__group > label {
  background-color: rgb(17, 17, 17);
  color: var(--neutral);
  min-width: 6rem;
  padding-inline: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.form__group > input,
.form__group > select,
.form__group > textarea {
  padding-block: 0.35rem;
  padding-left: 0.5rem;
  width: 100%;
}

.submit__btn {
  background-color: rgb(37, 37, 238);
  color: var(--neutral);
  padding-block: 0.5rem;
  width: 100%;
  max-width: 600px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.5s ease;
}

.submit__btn:hover {
  border-radius: 1rem 0 1rem 0;
}

.submit__btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: rgb(128, 128, 128);
}

@media screen and (min-width: 700px) {
  h2 {
    font-size: 1.5rem;
  }

  .modal-content {
    padding: 2rem;
  }

  .form__group > * {
    font-size: 0.9rem;
  }

  .form__group > label {
    min-width: 7rem;
  }
}
</style>
