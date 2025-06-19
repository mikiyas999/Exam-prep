import { db } from "@/db/drizzle";
import { questions } from "@/db/schema";

async function seedQuestions() {
  await db.insert(questions).values([
    {
      questionText: "What is 5 + 7?",
      options: ["10", "11", "12", "13"],
      correctAnswer: "12",
      explanation: "5 plus 7 equals 12.",
      imageUrl: null,
      questionType: "math",
      category: "pilot",
      difficulty: "easy",
      createdBy: 1,
    },
    {
      questionText: "Which direction does a compass needle usually point?",
      options: ["East", "West", "North", "South"],
      correctAnswer: "North",
      explanation: "A magnetic compass typically points to magnetic north.",
      imageUrl: null,
      questionType: "reading",
      category: "pilot",
      difficulty: "easy",
      createdBy: 1,
    },
    {
      questionText: "Identify the next shape in the sequence: ◯ ◯ ◯ □ □ ?",
      options: ["◯", "□", "△", "◇"],
      correctAnswer: "□",
      explanation:
        "Three circles followed by two squares implies the next is also a square.",
      imageUrl: null,
      questionType: "abstract",
      category: "hostess",
      difficulty: "medium",
      createdBy: 1,
    },
    {
      questionText: "What tool measures voltage?",
      options: ["Ammeter", "Voltmeter", "Ohmmeter", "Barometer"],
      correctAnswer: "Voltmeter",
      explanation: "A voltmeter measures electrical potential difference.",
      imageUrl: null,
      questionType: "mechanical",
      category: "amt",
      difficulty: "medium",
      createdBy: 1,
    },
    {
      questionText: "Which shape has three sides?",
      options: ["Square", "Rectangle", "Triangle", "Circle"],
      correctAnswer: "Triangle",
      explanation: "A triangle has three sides.",
      imageUrl: null,
      questionType: "math",
      category: "hostess",
      difficulty: "easy",
      createdBy: 1,
    },
    {
      questionText:
        "In which situation would a hostess need assertive communication?",
      options: [
        "Serving food",
        "Handling a passenger complaint",
        "Greeting at the gate",
        "Making announcements",
      ],
      correctAnswer: "Handling a passenger complaint",
      explanation:
        "Assertiveness is important when managing complaints or conflicts.",
      imageUrl: null,
      questionType: "reading",
      category: "hostess",
      difficulty: "medium",
      createdBy: 1,
    },
    {
      questionText: "What component stores electrical energy in a circuit?",
      options: ["Resistor", "Capacitor", "Inductor", "Diode"],
      correctAnswer: "Capacitor",
      explanation:
        "A capacitor stores energy in the form of an electric field.",
      imageUrl: null,
      questionType: "mechanical",
      category: "amt",
      difficulty: "medium",
      createdBy: 1,
    },
    {
      questionText: "Which number completes the pattern: 2, 4, 8, 16, ?",
      options: ["18", "24", "32", "20"],
      correctAnswer: "32",
      explanation: "The sequence doubles each time.",
      imageUrl: null,
      questionType: "abstract",
      category: "pilot",
      difficulty: "easy",
      createdBy: 1,
    },
    {
      questionText: "Which shape has no edges?",
      options: ["Triangle", "Square", "Sphere", "Cube"],
      correctAnswer: "Sphere",
      explanation: "A sphere is a smooth surface with no edges or corners.",
      imageUrl: null,
      questionType: "abstract",
      category: "pilot",
      difficulty: "medium",
      createdBy: 1,
    },
    {
      questionText:
        "What is the best response when a fire breaks out in the galley?",
      options: [
        "Run to the cockpit",
        "Ignore and continue service",
        "Use a fire extinguisher",
        "Call for a doctor",
      ],
      correctAnswer: "Use a fire extinguisher",
      explanation:
        "Cabin crew are trained to use onboard extinguishers immediately.",
      imageUrl: null,
      questionType: "reading",
      category: "hostess",
      difficulty: "hard",
      createdBy: 1,
    },
  ]);

  console.log("✅ Seeded 10 dummy questions.");
}

seedQuestions()
  .catch((err) => {
    console.error("❌ Error seeding questions:", err);
  })
  .finally(() => process.exit());
