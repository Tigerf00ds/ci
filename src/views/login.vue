<!-- <template>

  <form class="flex justify-center items-center mt-20 gap-2.5 flex-col" type="submit">
    <input type="text" placeholder="Nom d'utilisateur" v-model="username" required
      class="px-5 py-2.5 rounded-3xl ring-1 ring-cyan-700">
    <input type="password" placeholder="Mot de passe" v-model="password" required
      class="px-5 py-2.5 rounded-3xl ring-1 ring-cyan-700">
    <p>Vous n'avez pas de compte <router-link to="/register" class="text-blue-600">Inscrivez-vous !</router-link></p>
    <button type="button" @click="verify"
      class="px-5 py-2.5 bg-cyan-700 text-white border-none rounded-3xl hover:bg-cyan-950"
      >Se connecter</button>
  </form>
  <div class="text-red-600 my-10 text-center">
    <p v-for="erreur in erreurs">
      {{ erreur }}
    </p>
  </div>

</template>


<script setup>
import { useStore } from 'vuex'
import { ref, computed } from 'vue';
import { useRouter } from "vue-router";

const store = useStore()
const router = useRouter()

const username = ref('admin')
const password = ref('admin')

const erreurs = ref([])

const verify = (event) => {

  event.preventDefault()
  erreurs.value = []

  if (!username.value.length) {
    erreurs.value.push('Le champ nom d\'utilisateur est obligatoire !')
  }

  if (!password.value.length) {
    erreurs.value.push('Le champ mot de passe est obligatoire !');
  }

  if (erreurs.value.length === 0) {
    login();
  }
}

const setTokenStore = (token) => {
  if (token && token.token) {
    try {
      const user = JSON.parse(atob(token.token.split('.')[1]))

      store.commit('setUser', user)
      store.commit('setToken', token.token)
      store.commit('createToken', token.token)

      if (user.role == "admin") {
        router.push('/profileAdmin')
      } else {
        router.push('/profileUser')
      }

    } catch (error) {
      console.error('Erreur lors du traitement du token:', error)
    }
  } else {
    console.error('Token ou structure de réponse invalide')
  }
}

const login = async () => {
  const data = {
    username: username.value,
    password: password.value,
  };

  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/plain, /',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Erreur lors de la connexion:', response.statusText);
      erreurs.value.push('Nom d\'utilisateur ou mot de passe invalides !')
      return;
    }

    const result = await response.json();

    if (result && result.token) {
      setTokenStore(result);
    } else {
      console.error('Réponse de l\'API invalide:', result);
    }
  } catch (err) {
    console.error('Erreur durant la connexion: ', err);
  }
};

</script> -->




<template>
  <form @submit.prevent="verify" class="login-form">
    <!-- Champ Nom d'utilisateur -->
    <input 
      type="text" 
      placeholder="Nom d'utilisateur" 
      v-model="username" 
      required 
      class="input-field"
    />

    <!-- Champ Mot de passe -->
    <input 
      type="password" 
      placeholder="Mot de passe" 
      v-model="password" 
      required 
      class="input-field"
    />

    <!-- Lien vers l'inscription -->
    <p>
      Vous n'avez pas de compte ? 
      <router-link to="/register" class="register-link">Inscrivez-vous !</router-link>
    </p>

    <!-- Bouton de connexion -->
    <button type="submit" class="submit-button">Se connecter</button>
  </form>

  <!-- Affichage des erreurs -->
  <div v-if="erreurs.length" class="error-messages">
    <p v-for="erreur in erreurs" :key="erreur">{{ erreur }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { useStore } from 'vuex';

// Références pour les données du formulaire
const username = ref('');
const password = ref('');

// Référence pour les messages d'erreurs
const erreurs = ref([]);

const router = useRouter();
const store = useStore();

// Fonction de vérification
const verify = () => {
  erreurs.value = [];

  // Vérification des champs
  if (!username.value) erreurs.value.push("Le nom d'utilisateur est obligatoire !");
  if (!password.value) erreurs.value.push("Le mot de passe est obligatoire !");

  // Si aucune erreur, exécuter la connexion
  if (!erreurs.value.length) {
    login();
  }
};

// Fonction de gestion du token après connexion réussie
const setTokenStore = (token) => {
  try {
    const user = JSON.parse(atob(token.token.split('.')[1]));
    store.commit('setUser', user);
    store.commit('setToken', token.token);

    // Redirection en fonction du rôle
    if (user.role === "admin") {
      router.push('/profileAdmin');
    } else {
      router.push('/profileUser');
    }
  } catch (error) {
    console.error('Erreur lors du traitement du token:', error);
  }
};

// Fonction de connexion
const login = async () => {
  const data = { username: username.value, password: password.value };

  try {
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      erreurs.value.push("Nom d'utilisateur ou mot de passe invalide !");
      return;
    }

    const result = await response.json();
    if (result.token) {
      setTokenStore(result);
    }
  } catch (error) {
    erreurs.value.push("Erreur lors de la connexion.");
    console.error('Erreur:', error);
  }
};
</script>

<style scoped>
/* Conteneur du formulaire */
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

/* Champs de saisie */
.input-field {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  max-width: 300px;
  font-size: 16px;
}

/* Bouton de soumission */
.submit-button {
  background-color: #2196F3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #1976D2;
}

/* Lien vers la page d'inscription */
.register-link {
  color: #2196F3;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

/* Affichage des erreurs */
.error-messages {
  color: red;
  text-align: center;
  margin-top: 20px;
}
</style>

