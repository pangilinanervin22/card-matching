const mainDeck = document.getElementById("cards");
const timer = document.getElementById("timer");
const modal = document.getElementById("modal_overlay");
const modalButton = document.getElementById("modal_button");
const modalMessage = document.getElementById("modal_message");
const domScore = document.getElementById("score");
let time;
let level;
let arrayDeck = [];
let foundPair = [];
let firstCard, secondCard;
let score = 0;

/* 
mainDeck = parent div for adding cards
arrayDeck = reference main deck
foundPair = reference all cards that have been paired
firstCard/secondCard = for identifying choosen card (dom element)
*/

function reset() {
	level = 1;
	time = 40;
	score = 0;
	start();
	startTime();
}

function start() {
	mainDeck.innerHTML = "";
	arrayDeck = [...createRandomArray(level * 2)];
	firstCard = secondCard = false;
	foundPair = [];

	//setup a deck on dom and add all eventlistener
	for (const item of arrayDeck) createCard(item);
	for (const item of arrayDeck) clickCard(item);

	console.log(arrayDeck);
}

function nextLevel() {
	level = level === 3 ? level : ++level;
	time += 15;
	score += 50;
	start();
}

function createCard(id) {
	mainDeck.innerHTML += `<div id="card${id}" class="card"/> `;
}

function clickCard(id) {
	const item = document.getElementById(`card${id}`);

	item.addEventListener("click", () => {
		cardRotate(item, true);
		checkPair(item, item);
	});
}

function checkPair(card) {
	if (card === firstCard || card === secondCard || foundPair.includes(getIdNumber(card))) return;

	if (!firstCard) firstCard = card;
	else secondCard = card;

	// two cards logic
	if (firstCard && secondCard)
		if (getIdNumber(firstCard) !== getIdNumber(secondCard)) {
			cardRotate(firstCard, false);
			cardRotate(secondCard, false);
			firstCard = secondCard = false;
		} else {
			foundPair.push(getIdNumber(card));
			firstCard = secondCard = false;
			score += 20;
			playSound("coin");
			checkWin();
		}
}

function checkWin() {
	if (foundPair.length === arrayDeck.length / 2) {
		playSound("win");
		setTimeout(() => {
			nextLevel();
		}, 1500);
	}
}

function cardRotate(item, enabler) {
	if (enabler) {
		item.classList.add("card_press");
		setTimeout(() => {
			item.textContent = getIdNumber(item);
		}, 500);
	} else {
		setTimeout(() => {
			item.classList.remove("card_press");
			item.textContent = " ";
		}, 1500);
	}
}

// setup
function getIdNumber(cardDom) {
	return cardDom.getAttribute("id")[cardDom.getAttribute("id").length - 1];
}

function startTime() {
	const wew = setInterval(() => {
		domScore.textContent = `Score: ${score}`;
		timer.textContent = timeConvert(--time);
		if (time <= 0) {
			modal.classList.toggle("hide");
			modal_message.textContent = "Total Score : " + score;
			playSound("lose");
			clearInterval(wew);
		}
	}, 1000);
}

modalButton.addEventListener("click", () => {
	modal.classList.toggle("hide");
	playSound("start");
	reset();
});

// starting point
reset();
