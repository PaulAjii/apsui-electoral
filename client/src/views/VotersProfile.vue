<template>
  <SectionLayout customClass="wrapper" sectionWrapper="profile__wrapper">
    <BackButton />
    <header class="profile__header">
      <h2>Voter's Details</h2>

      <button type="button" @click="handleEdit">
        {{ isEditing ? 'Cancel' : 'Edit Profile' }}
      </button>
    </header>

    <form>
      <div class="profile__details">
        <div class="detail">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="formData.name" :readonly="!isEditing" />
        </div>

        <div class="detail">
          <label for="matric-no">Matric No.</label>
          <input type="text" id="matric-no" :value="voterStore.voter.studentId" readonly />
        </div>

        <div class="detail">
          <label for="level">Level</label>
          <input type="text" id="level" v-model="formData.level" :readonly="!isEditing" />
        </div>

        <div class="detail">
          <label for="set">Set</label>
          <input type="text" id="set" :value="voterStore.voter.set" readonly />
        </div>

        <div class="detail" v-if="voterStore.voter.hasVoted !== undefined">
          <label for="status">Has Voted</label>
          <input
            type="text"
            id="status"
            :value="voterStore.voter.hasVoted === false ? 'No' : 'Yes'"
            readonly
          />
        </div>
      </div>

      <button class="update__btn" type="button" v-show="isEditing" @click="handleUpdate">
        Update Profile
      </button>
    </form>

    <div class="action__btn" v-if="voterStore.voter.role === 'admin'">
      <header>
        <h2>Admin Actions</h2>
      </header>

      <div class="action">
        <p class="subtitle">Add or Delete Candidates</p>
        <CtaButton link="/candidates" text="Candidates" btnClass="cta__btn-alt" />
      </div>
    </div>

    <div class="stat" v-if="!isEditing">
      <header>
        <h2>Voters' Statistics</h2>
      </header>

      <div class="stats__grid">
        <div v-for="(stat, level) in voterStats" :key="level" class="stat__card">
          <h3>{{ level }} level</h3>
          <div class="stat__info">
            <p>
              Total Voters: <span>{{ stat.total }}</span>
            </p>
            <p>
              Verified: <span>{{ stat.verified }}</span>
            </p>
            <p>
              Remaining: <span>{{ stat.total - stat.verified }}</span>
            </p>
            <div class="progress__bar">
              <div
                class="progress"
                :style="{ width: `${(stat.verified / stat.total) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SectionLayout>
</template>

<script setup>
import SectionLayout from '@/layout/SectionLayout.vue';
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useVotersStore } from '@/store/voters';
import { updateVoters, getAllVoters } from '@/services/apiServices';
import CtaButton from '@/components/CtaButton.vue';
import BackButton from '@/components/BackButton.vue';

const voterStore = useVotersStore();
const toast = useToast();

const isEditing = ref(false);
const error = ref(null);
const loading = ref(false);

const formData = ref({
  name: '',
  level: ''
});

const voterStats = computed(() => {
  const totalVoters = voterStore.voters;

  const stats = {
    100: { total: 0, verified: 0 },
    200: { total: 0, verified: 0 },
    300: { total: 0, verified: 0 },
    400: { total: 0, verified: 0 },
    500: { total: 0, verified: 0 }
  };

  totalVoters.forEach((voter) => {
    const level = voter.level;

    if (stats[level]) {
      stats[level].total++;

      if (!voter.isFirstTimeLogin) {
        stats[level].verified++;
      }
    }
  });

  return stats;
});

const handleEdit = () => {
  if (isEditing.value) {
    formData.value.name = voterStore.voter.name;
    formData.value.level = voterStore.voter.level;
  }
  isEditing.value = !isEditing.value;
};

const handleUpdate = async () => {
  try {
    loading.value = true;
    const response = await updateVoters(voterStore.voter._id, formData.value, voterStore);

    if (response.status === 'success') {
      toast.success('Profile Updated successfully');
    } else {
      throw new Error('Failed to update profile');
    }
  } catch (err) {
    error.value = err.message;
    toast.error(error.value);
  } finally {
    isEditing.value = false;
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    await getAllVoters(voterStore);

    if (voterStore.voter) {
      formData.value = {
        name: voterStore.voter.name,
        level: voterStore.voter.level
      };
    }
  } catch (error) {
    toast.error('Failed to load voter data');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.profile__header,
.action__btn > header {
  width: 100%;
  max-width: 600px;
  border-bottom: 2px solid var(--secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: 0.25rem;
}

.profile__header > h2,
.action__btn > header > h2 {
  font-size: 1.1rem;
  font-weight: 500;
}

.profile__header > button {
  background-color: rgb(37, 37, 238);
  color: var(--neutral);
  padding: 0.25rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  border: 2px solid rgb(37, 37, 238);
  transition: all 0.5s ease;
}

.profile__header > button:hover {
  background-color: transparent;
  color: rgb(37, 37, 238);
}

.profile__details {
  width: 100%;
  max-width: 600px;
  padding: 1.5rem 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail {
  display: flex;
  gap: 0.5rem;
  border: 2px solid rgb(17, 17, 17);
  border-radius: 0.25rem;
  font-size: 1rem;
}

.detail > * {
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 1px;
}

.detail > label {
  background-color: rgb(17, 17, 17);
  color: var(--neutral);
  min-width: 7rem;
  padding-inline: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.detail > input {
  padding-block: 0.35rem;
  width: 100%;
}

.update__btn {
  background-color: rgb(37, 37, 238);
  color: var(--neutral);
  padding: 0.75rem 1.5rem;
  width: 100%;
  max-width: 600px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.5s ease;
}

.update__btn:hover {
  border-radius: 1rem 0 1rem 0;
}

.action__btn {
  width: 100%;
  max-width: 600px;
  padding-top: 1rem;
  margin-top: 2rem;
}

.action__btn > header {
  margin-bottom: 1rem;
}

.action {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action > .subtitle {
  font-size: 14px;
  font-weight: 500;
}

.cta__btn-alt {
  border-color: var(--secondary);
  color: var(--secondary) !important;
}

.cta__btn-alt:hover {
  border-color: var(--secondary);
  background-color: var(--secondary) !important;
  color: var(--neutral) !important;
}

.stats__grid {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 200px;
  gap: 1rem;
  padding: 1rem 0.5rem;
  max-width: 1200px;
  overflow-x: scroll;
}

.stat__card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid var(--secondary);
}

.stat__card h3 {
  font-size: 0.875rem;
  color: var(--secondary);
  margin-bottom: 0.5rem;
  text-align: center;
}

.stat__info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat__info p {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}

.stat__info span {
  font-weight: 600;
  color: var(--secondary);
}

.progress__bar {
  width: 100%;
  height: 5px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: var(--secondary);
  transition: width 0.3s ease;
}

@media screen and (min-width: 700px) {
  .profile__header > h2 {
    font-size: 1.5rem;
  }

  .profile__header > button {
    font-size: 1rem;
  }

  .profile__details {
    gap: 1.5rem;
  }

  .detail > * {
    font-size: 1.1rem;
  }

  .detail > label {
    min-width: 9rem;
  }

  .action > .subtitle {
    font-size: 1rem;
  }

  .stats__grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    grid-auto-flow: row;
    overflow: hidden;
  }

  .stat__card h3 {
    font-size: 1.4rem;
  }

  .stat__info p {
    font-size: 1rem;
  }
}
</style>
