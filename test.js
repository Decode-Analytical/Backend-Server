const readline = require('readline');

// Define the MCQ questions and answers
const questions = [
  {
    question: 'What is the capital of France?',
    options: ['Berlin', 'London', 'Paris', 'Rome'],
    answer: 'Paris'
  },
  {
    question: 'Which planet is known as the "Red Planet"?',
    options: ['Mars', 'Venus', 'Mercury', 'Jupiter'],
    answer: 'Mars'
  },
  {
    question: 'Who painted the Mona Lisa?',
    options: ['Leonardo da Vinci', 'Vincent van Gogh', 'Pablo Picasso', 'Michelangelo'],
    answer: 'Leonardo da Vinci'
  }
];

// Function to display MCQ and take user input
function displayMCQ(index) {
  const questionObj = questions[index];
  const { question, options } = questionObj;

  console.log(`\n${index + 1}. ${question}\n`);
  options.forEach((option, idx) => console.log(`${idx + 1}. ${option}`));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('\nEnter the number of your answer: ', (answerIndex) => {
    rl.close();
    const selectedAnswer = options[answerIndex - 1];

    if (selectedAnswer === questionObj.answer) {
      console.log('\nCorrect Answer!\n');
    } else {
      console.log(`\nWrong Answer! The correct answer is: ${questionObj.answer}\n`);
    }

    if (index < questions.length - 1) {
      displayMCQ(index + 1); // Ask the next question
    } else {
      console.log('\nAll questions answered!');
    }
  });
}

// Start the MCQ quiz
console.log('Welcome to the MCQ Quiz!\n');
displayMCQ(0);