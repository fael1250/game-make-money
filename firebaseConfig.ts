import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// As credenciais agora são lidas de forma segura das Variáveis de Ambiente
// Na Vercel, você irá configurar essas variáveis nas configurações do projeto.
// Para rodar localmente, crie um arquivo .env na raiz do projeto com o mesmo conteúdo.
const firebaseConfig = {
  apiKey: import.meta.env._API_KEY,
  authDomain: import.meta.env._AUTH_DOMAIN,
  projectId: import.meta.env._PROJECT_ID,
  storageBucket: import.meta.env._STORAGE_BUCKET,
  messagingSenderId: import.meta.env._MESSAGING_SENDER_ID,
  appId: import.meta.env._APP_ID
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
