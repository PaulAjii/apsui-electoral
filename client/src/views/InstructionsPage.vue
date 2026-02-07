<template>
  <SectionLayout customClass="instructions__section" sectionWrapper="instructions__wrapper">
    <nav class="nav__container">
      <BackButton />
      <div class="menu">
        <RouterLink to="/" class="nav__link">Home</RouterLink>
        <RouterLink to="/voters/profile" class="nav__link">Profile</RouterLink>
        <p class="nav__link active">Instructions</p>
      </div>
    </nav>

    <header class="instructions__header">
      <h2 class="section__title">Voting Instructions</h2>
      <p class="subtitle">Please read carefully before proceeding to vote</p>
    </header>

    <div class="instructions__content">
      <section class="instruction__section">
        <h3 class="instruction__title">How to Vote</h3>
        <ul class="instruction__list">
          <li><strong>One Vote Per Position:</strong> For most positions (President, General Secretary, etc.), you can only select one candidate.</li>
          <li><strong>Multiple Votes for Senate:</strong> For Senate, you can select up to 3 candidates from your class level.</li>
          <li><strong>Deselect Candidates:</strong> Click on a selected candidate again to deselect them if you change your mind.</li>
          <li><strong>Navigate Positions:</strong> Use the "Previous" and "Continue" buttons to move between positions, or click the number buttons to jump directly to a position.</li>
          <li><strong>Skip Positions:</strong> You can skip any position, but you must vote for at least one position before submitting.</li>
        </ul>
      </section>

      <section class="instruction__section">
        <h3 class="instruction__title">Position Guide</h3>
        <div class="positions__grid">
          <div class="position__card">
            <h4>Executive Positions</h4>
            <p>President, Vice President, General Secretary, etc. Select one candidate per position.</p>
          </div>
          <div class="position__card">
            <h4>Senate Positions</h4>
            <p>Choose up to 3 senatorial candidates from your class level. You can only vote for candidates in your class.</p>
          </div>
        </div>
      </section>

      <section class="instruction__section">
        <h3 class="instruction__title">Important Notes</h3>
        <ul class="instruction__list">
          <li>⚠️ <strong>Review Before Submitting:</strong> Double-check all your votes before clicking "Submit Votes".</li>
          <li>⚠️ <strong>Confirmation Required:</strong> You will be asked to confirm your submission.</li>
          <li>⚠️ <strong>One Vote Only:</strong> Once you submit, you cannot vote again. Ensure all selections are correct.</li>
          <li>✓ <strong>Candidate Information:</strong> View each candidate's name, alias, and catchphrase to make an informed decision.</li>
        </ul>
      </section>

      <section class="instruction__section">
        <h3 class="instruction__title">Voting Process</h3>
        <ol class="instruction__list">
          <li>Read through all candidates for each position</li>
          <li>Select your preferred candidate(s)</li>
          <li>Navigate to the next position using the buttons</li>
          <li>Review all your selections at the end</li>
          <li>Click "Submit Votes" to complete the election</li>
          <li>Confirm your submission in the popup dialog</li>
        </ol>
      </section>
    </div>

    <div class="instructions__footer">
      <button class="proceed__btn" @click="proceedToPolls">
        I Understand, Let's Vote!
      </button>
    </div>
  </SectionLayout>
</template>

<script setup>
import SectionLayout from '../layout/SectionLayout.vue';
import BackButton from '@/components/BackButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const proceedToPolls = () => {
  localStorage.setItem('hasSeenInstructions', true);
  router.push('/polls');
}
</script>

<style scoped>
.instructions__section {
  overflow-y: auto;
  max-height: 100vh;
}

.nav__container {
  position: sticky;
  top: 0;
  background: white;
  z-index: 20;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgb(236, 236, 236);
}

.instructions__header {
  position: sticky;
  top: 35px;
  background: white;
  z-index: 18;
  padding: 1rem;
  border-bottom: 1px solid rgb(236, 236, 236);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section__title {
  font-size: 1.5rem;
  margin: 0;
  color: transparent;
  background: linear-gradient(90deg, rgb(76 175 80), rgb(255 152 0));
  background-clip: text;
  -webkit-background-clip: text;
}

.subtitle {
  font-size: 0.9rem;
  color: rgb(120, 120, 120);
  margin: 0.5rem 0 0 0;
}

.instructions__content {
  padding: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
  padding-top: 0.5rem;
}

.instruction__section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgb(250, 250, 250);
  border-radius: 8px;
  border-left: 4px solid rgb(76, 175, 80);
}

.instruction__title {
  font-size: 1.2rem;
  color: rgb(52, 52, 248);
  margin-top: 0;
  margin-bottom: 1rem;
}

.instruction__list {
  margin: 0;
  padding-left: 1.5rem;
  line-height: 1.8;
}

.instruction__list li {
  margin-bottom: 0.75rem;
  color: rgb(60, 60, 60);
}

.positions__grid {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.position__card {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid rgb(236, 236, 236);
}

.position__card h4 {
  margin: 0 0 0.5rem 0;
  color: rgb(52, 52, 248);
  font-weight: 600;
}

.position__card p {
  margin: 0;
  color: rgb(100, 100, 100);
  font-size: 0.95rem;
}

.instructions__footer {
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  margin-bottom: 8rem;
}

.proceed__btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.proceed__btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.proceed__btn:active {
  transform: translateY(0);
}

@media screen and (min-width: 600px) {
  .instructions__content {
    padding: 2rem;
  }

  .instruction__section {
    padding: 2rem;
  }

  .instruction__title {
    font-size: 1.4rem;
  }

  .section__title {
    font-size: 2rem;
  }

  .positions__grid {
    grid-template-columns: 1fr 1fr;
  }

  .instructions__footer {
    margin-bottom: 4rem;
  }
}
</style>
