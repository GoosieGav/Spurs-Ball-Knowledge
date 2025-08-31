export const sampleQuizzes = [
  {
    id: 1,
    title: "Spurs Legends: The Golden Years",
    description: "Test your knowledge of Tottenham's greatest players from the past decades",
    categories: ["Players - Legends", "History"],
    difficulty: "Medium",
    type: "Multiple Choice",
    questionCount: 15,
    estimatedTime: "8 minutes",
    isSpeedQuiz: false,
    thumbnail: "🏆",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Premier League Era Quiz",
    description: "From 1992 to now - how well do you know Spurs in the Premier League?",
    categories: ["Premier League", "History"],
    difficulty: "Hard",
    type: "Mixed",
    questionCount: 20,
    estimatedTime: "12 minutes",
    isSpeedQuiz: false,
    thumbnail: "⚽",
    createdAt: "2024-01-10"
  },
  {
    id: 3,
    title: "Current Squad Challenge",
    description: "Quick-fire questions about the current Tottenham first team",
    categories: ["Players - Current", "Squad"],
    difficulty: "Easy",
    type: "Speed",
    questionCount: 10,
    estimatedTime: "3 minutes",
    isSpeedQuiz: true,
    thumbnail: "⚡",
    createdAt: "2024-01-20"
  },
  {
    id: 4,
    title: "White Hart Lane Memories",
    description: "From the old ground to the new - test your stadium knowledge",
    categories: ["Stadium", "History"],
    difficulty: "Medium",
    type: "Typing",
    questionCount: 12,
    estimatedTime: "10 minutes",
    isSpeedQuiz: false,
    thumbnail: "🏟️",
    createdAt: "2024-01-08"
  },
  {
    id: 5,
    title: "European Nights",
    description: "Champions League, UEFA Cup, and Europa League adventures",
    categories: ["European Competition", "History"],
    difficulty: "Hard",
    type: "Multiple Choice",
    questionCount: 18,
    estimatedTime: "15 minutes",
    isSpeedQuiz: false,
    thumbnail: "🌟",
    createdAt: "2024-01-12"
  },
  {
    id: 6,
    title: "Derby Days Special",
    description: "Arsenal, Chelsea, West Ham - test your North London Derby knowledge",
    categories: ["Derbies", "Rivalries"],
    difficulty: "Medium",
    type: "Mixed",
    questionCount: 14,
    estimatedTime: "9 minutes",
    isSpeedQuiz: false,
    thumbnail: "🔥",
    createdAt: "2024-01-18"
  },
  {
    id: 7,
    title: "Tactics & Formations",
    description: "Managers, tactics, and playing styles through the years",
    categories: ["Tactics", "Managers"],
    difficulty: "Hard",
    type: "Typing",
    questionCount: 16,
    estimatedTime: "11 minutes",
    isSpeedQuiz: false,
    thumbnail: "📋",
    createdAt: "2024-01-05"
  },
  {
    id: 8,
    title: "Speed Quiz: Kit Numbers",
    description: "Quick-fire quiz about shirt numbers past and present",
    categories: ["Players - Current", "Players - Legends"],
    difficulty: "Easy",
    type: "Speed",
    questionCount: 8,
    estimatedTime: "2 minutes",
    isSpeedQuiz: true,
    thumbnail: "👕",
    createdAt: "2024-01-22"
  },
  {
    id: 9,
    title: "Youth Academy Heroes",
    description: "From the academy to the first team - test your knowledge",
    categories: ["Academy", "Players - Legends"],
    difficulty: "Medium",
    type: "Multiple Choice",
    questionCount: 13,
    estimatedTime: "7 minutes",
    isSpeedQuiz: false,
    thumbnail: "🌱",
    createdAt: "2024-01-14"
  },
  {
    id: 10,
    title: "Trophy Cabinet",
    description: "Cups, leagues, and silverware - know your Spurs trophies",
    categories: ["Trophies", "History"],
    difficulty: "Easy",
    type: "Mixed",
    questionCount: 11,
    estimatedTime: "6 minutes",
    isSpeedQuiz: false,
    thumbnail: "🏆",
    createdAt: "2024-01-16"
  }
];

export const categories = [
  "Premier League",
  "Players - Legends", 
  "Players - Current",
  "History",
  "Stadium",
  "European Competition",
  "Derbies",
  "Rivalries",
  "Tactics",
  "Managers",
  "Academy",
  "Trophies",
  "Squad"
];

export const difficulties = ["Easy", "Medium", "Hard"];

export const quizTypes = ["Multiple Choice", "Typing", "Mixed", "Speed"];
