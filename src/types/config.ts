export interface quizlist {
    id_quiz: number;
    nom_quiz: string;
}

export interface Quiz {
    nom_quiz: string,
    nom_question: questions[]
}

interface questions {
    nom_question: string,
    reponses: string[],
    reponse_correcte: string
}





