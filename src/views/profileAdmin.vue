<!-- <template>

    <div>
        <tableQuiz v-for="(quiz, index) in quizList"  :title="quiz.nom_quiz" :id="quiz.id_quiz"
        @delete="deleteQuiz(index)" />
    </div>

</template>

<script setup>
import tableQuiz from "/src/components/tableQuiz.vue"
import { ref, onMounted } from 'vue';



let quizList = ref([])

const deleteQuiz = (index) => {
    quizList.value.splice(index, 1)
}

const listQuiz = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/quiz/listQuiz', {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, /',
            },
        });
        if (!response.ok) {
            console.error('erreur');
            return;
        }
        const data = await response.json();
        quizList.value = data.quiz;
    } catch (err) {
        console.error('Erreur durant la création de la liste de quiz: ', err);
    }
}

onMounted(() => {
    listQuiz()
})


</script>

<style></style> -->


<template>
    <div class="profil-admin">
      <h1 class="main-title">Créer un nouveau quiz</h1>
  
      <form @submit.prevent="createQuiz" class="quiz-form">
        <!-- Titre du quiz -->
        <div class="form-group">
          <label for="quizTitle" class="form-label">Titre:</label>
          <input
            type="text"
            id="quizTitle"
            v-model="newQuiz.title"
            class="form-control input-large"
            placeholder="Entrez le titre du quiz"
            required
          />
        </div>
  
        <!-- Description du quiz -->
        <div class="form-group">
          <label for="quizDescription" class="form-label">Description:</label>
          <div id="quizDescription" class="description-box">
            <textarea
              v-model="newQuiz.description"
              class="form-control description-area"
              placeholder="Entrez la description du quiz"
              required
            ></textarea>
          </div>
        </div>
  
        <!-- Questions du quiz -->
        <div class="form-group">
          <label class="form-label">Questions:</label>
          <div v-for="(question, index) in newQuiz.questions" :key="index" class="question-group">
            <input
              type="text"
              v-model="question.text"
              :placeholder="'Question ' + (index + 1)"
              class="form-control input-large"
              required
            />
            <div v-for="(answer, ansIndex) in question.answers" :key="ansIndex" class="answer-group">
              <input 
                type="radio" 
                class="radio-button"
                :name="'question-' + index" 
                v-model="question.correctAnswer" 
                :value="ansIndex" 
              />
              <input
                type="text"
                v-model="question.answers[ansIndex]"
                :placeholder="'Réponse ' + (ansIndex + 1)"
                class="form-control input-large"
                required
              />
              <button type="button" @click="removeAnswer(index, ansIndex)" class="button button-red">Supprimer la réponse</button>
            </div>
            <button type="button" @click="addAnswer(index)" class="button button-blue">Ajouter une réponse</button>
            <button type="button" @click="removeQuestion(index)" class="button button-red">Supprimer la question</button>
          </div>
          <button type="button" @click="addQuestion" class="button button-blue add-question-button">Ajouter une question</button>
        </div>
  
        <button type="submit" class="styled-button">Créer le quiz</button>
      </form>
  
      <!-- Liste des quiz existants -->
      <h2 class="sub-title">Liste des Quiz</h2>
      <div>
        <tableQuiz
          v-for="(quiz, index) in quizList"
          :key="quiz.id_quiz"
          :title="quiz.nom_quiz"
          :id="quiz.id_quiz"
          @delete="deleteQuiz(index)"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import tableQuiz from '../components/tableQuiz.vue';
  import type { quizlist } from '../types/config';
  
  const newQuiz = ref({
    title: '',
    description: '',
    questions: [{ text: '', answers: [''], correctAnswer: null }]
  });
  
  const quizList = ref<quizlist[]>([]);
  
  const addQuestion = () => {
    newQuiz.value.questions.push({ text: '', answers: [''], correctAnswer: null });
  };
  
  const removeQuestion = (index: number) => {
    newQuiz.value.questions.splice(index, 1);
  };
  
  const addAnswer = (questionIndex: number) => {
    newQuiz.value.questions[questionIndex].answers.push('');
  };
  
  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    newQuiz.value.questions[questionIndex].answers.splice(answerIndex, 1);
  };
  
 const createQuiz = async () => {
  try {
    // Vérifiez le format des données avant l'envoi
    const formattedQuiz = {
      name: newQuiz.value.title,  // Renommez le titre en "name" pour correspondre à l'API
      description: newQuiz.value.description,
      questions: newQuiz.value.questions.map((question) => ({
        nom_question: question.text,  // "text" correspond à la question
        reponses: question.answers,  // Tableau de réponses
        reponse_correcte: question.correctAnswer,  // Index de la bonne réponse
      })),
    };

    console.log('Données envoyées au backend:', formattedQuiz);

    const response = await fetch('http://localhost:3000/api/quiz/creationQuiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedQuiz),  // Envoyer les données formatées
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la création du quiz');
    }

    const data = await response.json();
    console.log('Quiz créé avec succès:', data);

    // Réinitialiser le formulaire après succès
    newQuiz.value = { title: '', description: '', questions: [{ text: '', answers: [''], correctAnswer: null }] };
    listQuiz();  // Rafraîchir la liste des quiz
  } catch (err) {
    console.error('Erreur durant la création du quiz:', err.message);
  }
};

  
  const deleteQuiz = (index: number) => {
    quizList.value.splice(index, 1);
  };
  
  const listQuiz = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/quiz/listQuiz', {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, /',
        },
      });
      if (!response.ok) {
        console.error('Erreur lors de la récupération des quiz');
        return;
      }
      const data = await response.json();
      quizList.value = data.quiz;
    } catch (err) {
      console.error('Erreur durant la récupération des quiz:', err);
    }
  };
  
  onMounted(() => {
    listQuiz();
  });
  </script>
  
  <style scoped>
  /* Page container */
  .profil-admin {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
    font-family: 'Arial', sans-serif;
  }
  
  /* Title: Créer un nouveau quiz */
  .main-title {
    font-size: 3.5em;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  
  /* Subtitle: Liste des Quiz */
  .sub-title {
    font-size: 2em;
    margin-top: 40px;
    margin-bottom: 20px;
  }
  
  /* Form styling */
  .quiz-form {
    display: flex;
    flex-direction: column;
  }
  
  /* Form label and inputs */
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-label {
    font-size: 1.5em;
    margin-bottom: 10px;
    display: block;
  }
  
  /* Text inputs */
  .form-control {
    width: 100%;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-size: 1.2em;
  }
  
  .input-large {
    width: 100%;
    padding: 12px;
  }
  
  .description-box {
    margin-top: 10px;
  }
  
  .description-area {
    height: 100px;
    resize: vertical;
    padding: 12px;
    font-size: 1.2em;
  }
  
  /* Question and answer group styling */
  .question-group {
    margin-bottom: 20px;
  }
  
  .answer-group {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .radio-button {
    margin-right: 15px;
  }
  
  /* Buttons */
  .button {
    padding: 8px 12px;
    margin-right: 10px;
    font-size: 1em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .button-red {
    background-color: #f44336;
    color: white;
  }
  
  .button-red:hover {
    background-color: #d32f2f;
  }
  
  .button-blue {
    background-color: #2196F3;
    color: white;
  }
  
  .button-blue:hover {
    background-color: #1976D2;
  }
  
  .add-question-button {
    background-color: #4CAF50;
    margin-top: 10px;
  }
  
  .add-question-button:hover {
    background-color: #388E3C;
  }
  
  /* Submit button */
  .styled-button {
    background-color: #4CAF50;
    color: white;
    padding: 15px 32px;
    font-size: 1.2em;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: inline-block;
    margin-top: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .styled-button:hover {
    background-color: #45a049;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  </style>



  