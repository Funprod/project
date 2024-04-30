let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["палка"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
    {
        name: "палка", power: 5
    },
    {
        name: "кинжал", power: 30
    },
    {
        name: "большой молот", power: 50
    },
    {
        name: "меч", power: 100
    }
];
const locations = [
    {
        name: "town square",
        "button text": ["Магазин", "Подземелье", "Битва с драконом"],
        "button functions": [goStore, goCave, fightDragon],
        text: "Вы вернулись на площадь и стоите рядом с \"Магазином\"."
    },
    {
        name: "store",
        "button text": ["Купить 10 здоровья (10 зол.)", "Купить оружие (30 зол.)", "Назад"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "Вы в магазине"
    },
    {
        name: "cave",
        "button text": ["Битва с слизью", "Битва со зверем", "Назад"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "Вы вошли в подьземелье и видите монстров."
    },
    {
        name: "fight",
        "button text": ["Атака", "Уклониться", "Бежать"],
        "button functions": [attack, dodge, goTown],
        text: "Вы сражаетесь с монстром."
    },
    {
        name: "kill monster",
        "button text": ["Вернуться", "Вернуться", "Вернуться"],
        "button functions": [goTown, goTown, goTown],
        text: "Ура! Вы победили монстра. Вы получаете опыт и немого золота"
    },
    {
        name: "lose",
        "button text": ["Начать заново?", "Начать заново?", "Начать заново?"],
        "button functions": [restart, restart, restart],
        text: "Вас убили, попробуйте еще раз. &#x2620;"
    },
    {
        name: "win",
        "button text": ["Начать заново?", "Начать заново?", "Начать заново?"],
        "button functions": [restart, restart, restart],
        text: "Ура! Вы победили дракона! &#x1F389;"
    }
];

const monsters = [
    {
        name: "слизь",
        level: 2,
        health: 15
    },
    {
        name: "зверь",
        level: 8,
        health: 60
    },
    {
        name: "дракон",
        level: 20,
        health: 300
    },
];

// initialize buttons.
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerHTML = location.text;
}

function goTown() {
    update(locations[0])
}

function goStore() {
    update(locations[1])

}

function goCave() {
    update(locations[2])
}

function buyHealth() {

    if (gold >= 10) {
        gold = gold - 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "У вас недостаточно золота для покупки здоровья."
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "Вы купили " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += " В вашем инвентаре находится: " + inventory
        } else {
            text.innerText = "У вас недостаточно золотоа для покупки новго оружия."
        }
    } else {
        text.innerText = "Вы уже куплили самое мощьное оружие!"
        button2.innerText = "Продать старое оружие за 15 зол.";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "Вы продали " + currentWeapon + ".";
        text.innerText += " В вашем инвентаре осталось: " + inventory.length + " оружия, " + inventory;
    } else {
        text.innerText = "у вас остался только меч"
    }
}

function fightSlime() {
    fighting = 0;
    goFight()
}

function fightBeast() {
    fighting = 1;
    goFight()
}

function fightDragon() {
    fighting = 2;
    goFight()
    //update(locations[])
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function attack() {
    text.innerText = "Вы атакуете " + monsters[fighting].name + "."
    text.innerText += " Вы изпользуете " + weapons[currentWeapon].name + " для атаки на монстра."
    health -= getMonsterAttackValue(monsters[fighting].level);
    if (isMonsterHit()) {
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    } else {
        text.innerText += " Вы промахнулись."
    }
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health <= 0) {
        lose()
    } else if (monsterHealth <= 0) {
        if (fighting === 2) {
            winGame()
        } else {
            defeatMonster()
        }
    }
    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += " Ваше оружие " + inventory.pop() + " сломано."
        currentWeapon--;
    }
}

function getMonsterAttackValue(level) {
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    return hit > 0 ? hit : 0;
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20;
}

function dodge() {
    text.innerText = "Вы уклоняетесь от атаки " + monsters[fighting].name;
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

function lose() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"]
    goldText.innerText = gold;
    xpText.innerText = xp;
    healthText.innerText = health;
    goTown()
}