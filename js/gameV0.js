let config = {
    type: Phaser.AUTO,
    width: 600,
    height: 640,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    autoCenter: true
};

let game = new Phaser.Game(config);
let backgroundImage;
let answerImage = [];
let answerText = [];
let answerNumber = 3;
let questionImage;
let playButtonImage;
let currentQuestionIndex = 0;
let starImage = [];
let score = 0;
let goodAnswerSound;
let wrongAnswerSound;

let welcomeImage, quizText, welcomeText, menuImage;

let quizzString; // = '{ "questions": [ { "title": "Quel célèbre dictateur dirigea l’URSS du milieu des années 1920 à 1953 ?", "answers": ["Lenine", "Staline", "Molotov"], "goodAnswerIndex" : 1 }, {"title": "Ma deuxième question", "answers": ["Réponse 0", "Réponse 1", "Réponse 2"],"goodAnswerIndex" : 0}]}';
let quizz; // = JSON.parse(quizzString);


/*
let quizz = { "questions": [ 
    { 
        "title": "Quel célèbre dictateur dirigea l’URSS du milieu des années 1920 à 1953 ?", 
        "answers": [
            "Lenine", 
            "Staline", 
            "Molotov"], 
        "goodAnswerIndex" : 1 }, 
    {
        "title": "Ma deuxième question", 
        "answers": [
            "Réponse 0", 
            "Réponse 1", 
            "Réponse 2"],
            "goodAnswerIndex" : 0}
        ]
    };
*/

function preload() {
    this.load.image('background', './assets/Sprites/background.png');
    this.load.image('labelquestion', './assets/Sprites/label1.png');
    this.load.image('labelanswer', './assets/Sprites/label2.png');
    this.load.image('play', './assets/sprites/play.png');
    this.load.image('starOn', './assets/sprites/star.png');

    this.load.json('questions', './assets/data/questions.json');

    this.load.audio('goodSound', './assets/sound/good.wav')
    this.load.audio('wrongSound', './assets/sound/wrong.wav')

    this.load.image('menuBackground', './assets/sprites/windows3.png');
    this.load.image('menu', './assets/sprites/menu.png');


}

function create() {
    quizz = this.cache.json.get('questions');
    backgroundImage = this.add.image(0, 0, 'background');
    backgroundImage.setOrigin(0, 0);
    backgroundImage.setScale(0.5);

    // build home screen 
    welcomeImage = this.add.image(300, 280, 'menuBackground');
    welcomeImage.setScale(0.8);
    quizText = this.add.text(270, 110, "QUIZZ", { fontFamily: 'Arial', fontSize: 20, color: ' #000000 ' });
    welcomeText = this.add.text(110, 230, "Pousser sur le bouton pour commencer le quiz.", { fontFamily: 'Arial', fontSize: 18, color: ' #000000 ' });
    menuImage = this.add.image(300, 340, 'menu').setInteractive();
    menuImage.setScale(0.5);
    menuImage.on('pointerdown', displayGameScreen);

    welcomeImage.setVisible(true);
    quizText.setVisible(true);
    welcomeText.setVisible(true);
    menuImage.setVisible(true);


    // quizz questions and answers
    questionImage = this.add.image(300, 100, 'labelquestion');
    questionImage.setScale(0.5);
    questionImage.setVisible(false);
    for (let i = 0; i < answerNumber; i++) {
        answerImage[i] = this.add.image(300, 220 + i * 110, 'labelanswer').setInteractive();
        answerImage[i].on('pointerdown', () => { checkAnswer(i) });
        answerImage[i].setScale(1.0);
        answerImage[i].setVisible(false);
    }
    questionText = this.add.text(150, 80, quizz.questions[0].title, { fontFamily: 'Arial', fontSize: 18, color: ' #ffffff ' });
    questionText.setVisible(false);
    for (let i = 0; i < answerNumber; i++) {
        answerText[i] = this.add.text(190, 210 + i * 110, quizz.questions[0].answers[i], { fontFamily: 'Arial', fontSize: 18, color: ' #000000' });
        answerText[i].setVisible(false);
    }

    playButtonImage = this.add.image(300, 550, 'play').setInteractive();
    playButtonImage.on('pointerdown', displayNextQuestion);
    playButtonImage.setScale(0.3);
    playButtonImage.setVisible(false); // playButtonImage.alpha = 0;

    for (let i = 0; i < 10; i++) {
        starImage[i] = this.add.image(30 + i * 60, 600, 'starOn');
        starImage[i].setScale(0.2);
        starImage[i].alpha = 0.5;
        starImage[i].setVisible(false);
    }

    goodAnswerSound = this.sound.add('goodSound');
    wrongAnswerSound = this.sound.add('wrongSound');
}

function update() {

}

function checkAnswer(answerIndex) {
    if (answerIndex == quizz.questions[currentQuestionIndex].goodAnswerIndex) {
        goodAnswerSound.play();
        alert("OK");
        starImage[currentQuestionIndex].alpha = 1;
        score++;
    }
    else {
        wrongAnswerSound.play();
        alert("Pas OK");
        starImage[currentQuestionIndex].tint = 0xff0000;    // 0x a la place du # ! 
    }
    playButtonImage.setVisible(true);   // playButtonImage.alpha = 1;
    for (let i = 0; i < 3; i++) answerImage[i].disableInteractive();
}

function displayNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex == 10) {
        alert("Vous avez " + score + "/10");
    }
    questionText.text = quizz.questions[currentQuestionIndex].title;
    for (let i = 0; i < 3; i++) {
        answerText[i].text = quizz.questions[currentQuestionIndex].answers[i];
    }
    playButtonImage.setVisible(false);
    for (let i = 0; i < 3; i++) answerImage[i].setInteractive();

}

function displayGameScreen() {

    welcomeImage.setVisible(false);
    quizText.setVisible(false);
    welcomeText.setVisible(false);
    menuImage.setVisible(false);

    questionImage.setVisible(true);
    questionText.setVisible(true);

    for (let i = 0; i < answerNumber; i++) {
        answerImage[i].setVisible(true);
        answerText[i].setVisible(true);
    }
    for (let i = 0; i < 10; i++) {
        starImage[i].setVisible(true);
    }


}



/*

- quizz
    - question []
        -title (string)
        -answer [] (string)
        -goodAnswerIndex (int)

Implémentation dans :
    - une Base de données
    - CSV
    - XML
    - JSON
    - YAML

XML :
    <quizz>
        <question>
            <title>la première question ?</title>
            <answer i="0"> Réponse 0</answer>
            <answer i="1"> Réponse 1</answer>
            <answer i="2"> Réponse 2</answer>
            <goodAnswerIndex>1</goodAnswerIndex>
        </question>
    </quizz>

YAML :
    quizz :
        question :
            title : "La première question"
            answer : "Réponse 0"
            goodAnswerIndexAnswerIndex : 1
        question :
            title : "La première question"
            answer : "Réponse 0"
            goodAnswerIndexAnswerIndex : 0

JSON :
    {
        "questions":[
            {
                "title": "Ma premère question",
                "answer": ["réponse 0", "Réponse 1"],
                "goodAnswerIndex" : 1
            },
            {
 */