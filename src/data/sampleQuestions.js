export const sampleQuestions = [
  {
    id: 1,
    text: "Who scored the winning goal in the 2019 Champions League Semi-Final against Ajax?",
    type: "MC",
    options: ["Harry Kane", "Son Heung-min", "Lucas Moura", "Christian Eriksen"],
    correctAnswer: "Lucas Moura",
    explanation: "Lucas Moura completed his hat-trick with a 96th-minute winner to secure Tottenham's place in the Champions League final."
  },
  {
    id: 2,
    text: "In which year was White Hart Lane first opened?",
    type: "MC",
    options: ["1899", "1901", "1904", "1907"],
    correctAnswer: "1899",
    explanation: "The original White Hart Lane stadium was opened in 1899 and served as Tottenham's home until 2017."
  },
  {
    id: 3,
    text: "Type the name of Tottenham's manager who led them to the Premier League in 1992:",
    type: "Typing",
    correctAnswer: "Terry Venables",
    explanation: "Terry Venables was the manager who guided Tottenham into the inaugural Premier League season in 1992-93."
  },
  {
    id: 4,
    text: "Which player holds the record for most appearances for Tottenham Hotspur?",
    type: "MC",
    options: ["Steve Perryman", "Gary Mabbutt", "Ledley King", "Glenn Hoddle"],
    correctAnswer: "Steve Perryman",
    explanation: "Steve Perryman made 854 appearances for Tottenham between 1969 and 1986, a club record that still stands today."
  },
  {
    id: 5,
    text: "What is the capacity of the new Tottenham Hotspur Stadium?",
    type: "MC",
    options: ["58,000", "60,000", "62,850", "65,000"],
    correctAnswer: "62,850",
    explanation: "The new Tottenham Hotspur Stadium, opened in 2019, has a capacity of 62,850, making it the largest club stadium in London."
  },
  {
    id: 6,
    text: "Type the nickname given to the famous Tottenham team of the early 1960s:",
    type: "Typing",
    correctAnswer: "The Double Team",
    explanation: "The 1960-61 Tottenham team was known as 'The Double Team' after becoming the first team in the 20th century to win both the First Division and FA Cup in the same season."
  },
  {
    id: 7,
    text: "Who was Tottenham's top scorer in the 2020-21 Premier League season?",
    type: "MC",
    options: ["Harry Kane", "Son Heung-min", "Gareth Bale", "Carlos Vinicius"],
    correctAnswer: "Harry Kane",
    explanation: "Harry Kane scored 23 goals in the 2020-21 Premier League season, finishing as the league's top scorer and winning the Golden Boot."
  },
  {
    id: 8,
    text: "Type the year when Tottenham last won the league title:",
    type: "Typing",
    correctAnswer: "1961",
    explanation: "Tottenham's last league title came in the 1960-61 season when they completed the famous Double, winning both the First Division and FA Cup."
  }
];

// Helper function to check typing answers (case-insensitive, allows for variations)
export const checkTypingAnswer = (userAnswer, correctAnswer) => {
  const normalizeAnswer = (answer) => {
    return answer.toLowerCase().trim()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' '); // Normalize whitespace
  };
  
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedCorrect = normalizeAnswer(correctAnswer);
  
  // Direct match
  if (normalizedUser === normalizedCorrect) {
    return true;
  }
  
  // Check if user answer contains all key words from correct answer
  const correctWords = normalizedCorrect.split(' ');
  const userWords = normalizedUser.split(' ');
  
  // For names or short answers, require exact match
  if (correctWords.length <= 2) {
    return normalizedUser === normalizedCorrect;
  }
  
  // For longer answers, check if all key words are present
  return correctWords.every(word => 
    userWords.some(userWord => userWord.includes(word) || word.includes(userWord))
  );
};
