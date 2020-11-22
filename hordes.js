init_defense = 20;
init_nbZombie = 10;
init_day = 1;
one_hour = 3600; //seconds
day_start_time = one_hour*6; //the day begins at 6am
day_end_time = one_hour*22; //the day ends at 10pm
defaultDiggingTime = one_hour*1;
nap_time = one_hour*3.75;
bricoBob_defense = 5;
maxProbabilityRessourceSaver = 0.5;
fastLearnerSkillAdvantage = 0.5;




class City{
    constructor(){
      this.defense = init_defense;
      this.nbZombie = init_nbZombie;

      this.inventory = ressources;
      this.buildings = listBuildings;

      this.day = init_day;
      this.time = day_start_time; //seconds (6:00 am)
      this.effectiveTime = 0;

      this.bobs = listBobs;
      this.skills = listSkills;
      this.fastLearnerSkillAdvantage = fastLearnerSkillAdvantage;
    }


    fullRessourcesInventory(){
        var cheatInventory = new Inventory();
        cheatInventory.add("wood", 100);
        cheatInventory.add("metal", 100);
        cheatInventory.add("screw", 100);

        this.inventory = cheatInventory;
        this.inventoryUpdate();
    }

    fullBobs(){
        var cheatBobsList = [];
        cheatBobsList.push(new DiggerBob(10));
        cheatBobsList.push(new BricoBob(10));
        cheatBobsList.push(new StupidBob(10));

        this.bobs = cheatBobsList;
        this.bobsUpdate();
    }

    resetInventory(){
        var resetInventory = new Inventory();
        resetInventory.add("wood", 0);
        resetInventory.add("metal", 0);
        resetInventory.add("screw", 0);

        this.inventory = resetInventory;
        this.inventoryUpdate();
    }

    resetBobs(){
        var listResetBobs = [];
        listResetBobs.push(new DiggerBob(0));
        listResetBobs.push(new DiggerBob(0));
        listResetBobs.push(new DiggerBob(0));

        this.bobs = listResetBobs;
        this.bobsUpdate();
    }

    getDiggingTime(){
        return defaultDiggingTime;
    }

    findAnItem(){
        var itemName = UsefulFunctions.randomItem();
        this.addItem(itemName, 1);
        this.addTime(this.getDiggingTime());
        return itemName;
    }

    onLoadBody(){
        this.update();
        this.startTime();
    }

    timeUpdate(){
        var timeString;
        if(this.time < day_end_time){
            timeString = UsefulFunctions.dayTimeToString(this.time);
            document.getElementById("time").innerHTML = timeString;
        }
        else{
            this.midnightAttack();
        }
    }

    startTime(){
        this.addUselessTime(25);//real game speed, les 16h d une journee correspondent environ a 2min
        setTimeout(function(myCity){myCity.startTime()}, 50, this);
    }

    dayUpdate(){
        document.getElementById("day").innerHTML = this.day;
    }
    nbZombieUpdate(){
        document.getElementById("nbZombie").innerHTML = this.nbZombie;
    }
    inventoryUpdate(){
        document.getElementById("inventory").innerHTML = this.inventory.toHtml();
    }

    defenseUpdate(){
        document.getElementById("defense").innerHTML = this.defense;
    }
    bobsUpdate(){
        document.getElementById("bobs").innerHTML = this.bobsToHtml();
    }


    update(){
        this.timeUpdate();
        this.dayUpdate();
        this.nbZombieUpdate();
        this.defenseUpdate();
        this.inventoryUpdate();
        this.bobsUpdate();
    }

    addTime(sec){
        this.time += sec;
        this.effectiveTime += sec;
        this.timeUpdate();
    }

    addUselessTime(sec){
        this.time += sec;
        this.timeUpdate();
    }

    addItem(item, nb){
        this.inventory.add(item, nb);
        this.inventoryUpdate();
    }

    addDefense(def){
        this.defense += def;
        this.defenseUpdate();
    }

    addZombie(nb){
        this.nbZombie += nb;
        this.nbZombieUpdate();
    }
    addDay(nb){
        this.day += nb;
        this.dayUpdate();
    }

    resetTime(){
        this.time = day_start_time;
        this.effectiveTime = 0;
        this.timeUpdate();
    }
    nbZombieToAdd(){
        return 5;
    }

    midnightAttack(){
        //bob actions
        var stringActionBobs = "Bob actions during the day:\n";
        for(let i = 0; i < this.bobs.length; i++){
            var stringActionResult = this.bobs[i].action(this);
            stringActionBobs += stringActionResult + "\n"
        }
        alert(stringActionBobs)

        var efficacity = Math.trunc((this.effectiveTime / (day_end_time - day_start_time))*100)
        alert("The attack is happening! \ndefense = " + this.defense + "\nnbZombie = " + this.nbZombie + "\nday efficacity = " + efficacity + "%");
        if(this.nbZombie > this.defense){
            alert("You haven't survived... \nYour score: day " + this.day);
        }
        else{
            alert("You survived");
        }
        //Updates for the next day
        this.addDay(1);
        this.resetTime();
        var nbZombieToAdd = this.nbZombieToAdd();
        this.addZombie(nbZombieToAdd);

        var bobNumber = UsefulFunctions.getRandomIntInclusive(0,2);
        this.bobs[bobNumber].add(1);
        this.bobsUpdate();
        alert("A new bob arrived in your city: " + this.bobs[bobNumber].name)
    }

    takeANap(){
        this.addUselessTime(nap_time);
    }


    buildingsActionToHtml(){
        var htmlString = "<table>";

        htmlString += "<tr>";
        htmlString += "<th>name<th>";
        htmlString += "<th>defense<th>";
        htmlString += "<th>level<th>";
        htmlString += "<th>maxLevel<th>";
        htmlString += "<th>ressourcesRequired<th>";
        htmlString += "<th>timeRequired<th>";
        htmlString += "<th>build it?<th>";
        htmlString += "</tr>";

        var numberOfBuildings = this.buildings.length;

        for(let i = 0; i < numberOfBuildings; i++){
            var building = this.buildings[i];
            htmlString += "<tr>";
            htmlString += "<th>" + building.name + "<th>";
            htmlString += "<th>" + building.defense + "<th>";
            htmlString += "<th>" + building.level + "<th>";
            htmlString += "<th>" + building.maxLevel + "<th>";
            htmlString += "<th>" + building.ressourcesRequired.toString() + "<th>";
            htmlString += "<th>" + UsefulFunctions.timeToString(building.getTimeRequired(this)) + "<th>";
            if(building.isBuildable(this)){
                htmlString += "<th><button onclick=\"myCity.build(" + i + ")\">+</button><th>";
            }
            htmlString += "</tr>";
        }
        htmlString = htmlString + "</table>";
        return htmlString;
    }

    skillsActionToHtml(){
        var htmlString = "<table>";

        htmlString += "<tr>";
        htmlString += "<th>name<th>";
        htmlString += "<th>level<th>";
        htmlString += "<th>maxLevel<th>";
        htmlString += "<th>timeRequired<th>";
        htmlString += "<th>upgrade it?<th>";
        htmlString += "</tr>";

        var numberOfSkills = this.skills.length;

        for(let i = 0; i < numberOfSkills; i++){
            var skill = this.skills[i];
            htmlString += "<tr>";
            htmlString += "<th>" + skill.name + "<th>";
            htmlString += "<th>" + skill.level + "<th>";
            htmlString += "<th>" + skill.maxLevel + "<th>";
            htmlString += "<th>" + UsefulFunctions.timeToString(skill.getTimeRequired(this)) + "<th>";
            if(skill.isUpgradable(this)){
                htmlString += "<th><button onclick=\"myCity.upgradeSkill(" + i + ")\">+</button><th>";
            }
            htmlString += "</tr>";
        }
        htmlString = htmlString + "</table>";
        return htmlString;
    }

    bobsToHtml(){
        var htmlString = "<ul>";
        var numberOfBobs = this.bobs.length;
        for(let i = 0; i < numberOfBobs; i++){
            var bob = this.bobs[i]
            htmlString = htmlString + "<li><p>" + bob.nb + " " + bob.name + "</li></p>";
        }
        htmlString = htmlString + "</ul>";
        return htmlString;
    }

    addBob(bobName, nb){
        var bob = UsefulFunctions.searchObjetInArray(bobName, this.bobs);
        bob.add(1);
    }


    skillsToHtml(){
        var skillsHtml = "<ul>";
        var numberOfSkills = this.skills.length;
        for(let i = 0; i < numberOfSkills; i++){
            var skill = this.skills[i];
            skillsHtml = skillsHtml + "<li><p>" + skill.name + " lvl" + skill.level + "</li></p>"; // value key
        }
        skillsHtml = skillsHtml + "</ul>";
        return skillsHtml;
    }

    upgradeSkill(i){
        this.skills[i].upgrade(this);;
        this.timeUpdate();
        this.displayUpgradeSkillsAction();
    }
    
    

    displayBuildAction(){
        document.getElementById("actionDisplay").innerHTML = this.buildingsActionToHtml();
    }

    displayUpgradeSkillsAction(){
        document.getElementById("actionDisplay").innerHTML = this.skillsActionToHtml();
    }
    
    build(i){ //index of the building to build
        this.buildings[i].build(this);
    }

    bobArrival(){
        var bobname = UsefulFunctions.randomBob();
        this.addBob(bobname, 1);
        myCity.bobsUpdate();
    }
  }

  class Inventory{
    constructor(){
        this.dictionary = new Map([]);
    }

    add(itemName, nb){
        if(this.dictionary.has(itemName)){
            this.dictionary.set(itemName, nb + this.dictionary.get(itemName));
        }
        else{
            this.dictionary.set(itemName, nb);
        }
    }

    toHtml(){
        var dictionaryToHtml = "<ul>";
        var iterator1 = this.dictionary.entries();
        for(let item of iterator1){
            dictionaryToHtml = dictionaryToHtml + "<li><p>" + item[1] + " " + item[0] + "</li></p>"; // value key
        }
        dictionaryToHtml = dictionaryToHtml + "</ul>";
        return dictionaryToHtml;
    }

    contains(inventory2){
        var thisContainsInventory2 = true;
        var iterator1 = inventory2.dictionary.entries();
        for(let item of iterator1){
            if(this.dictionary.has(item[0])){
                if(this.dictionary.get(item[0]) >= item[1]){
                    //we have the ressources required
                }
                else{
                    thisContainsInventory2 = false;
                }
            }
            else{
                thisContainsInventory2 = false;
            }
        }
        return thisContainsInventory2;
    }

    containsItem(itemName){
        if(this.dictionary.has(itemName)){
            var nb = this.dictionary.get(itemName);
            return nb > 0;
            //
        }
        else{
            return false;
        }
    }

    isEmpty(){
        var iterator1 = this.dictionary.entries();
        for(let item of iterator1){
            if(item[1] != 0){
                return false;
            }
        }
        return true;
    }

    looseItem(){
        if(this.dictionary.isEmpty()){
            return undefined;
        }
        else{
            itemName = UsefulFunctions.randomItem();
            if(this.containsItem(itemName)){
                this.add(itemName, -1);
                return itemName;
            }
            else{
                return this.looseItem();
            }
        }
    }

    addInventory(inventory2){
        var iterator1 = inventory2.dictionary.entries();
        for(let item of iterator1){
            this.add(item[0], item[1]);
        }
    }

    numberOfItems(){
        var nb = 0;
        var iterator1 = this.dictionary.entries();
        for(let item of iterator1){
            nb += item[1];
        }
        return nb;
    }

    mapToArray(){
        var L = [];
        var iterator1 = this.dictionary.entries();
        for(let item of iterator1){
            L.push({name:item[0], nb:item[1]});
        }
        return L;
    }

    minus(inventory2){
        var iterator1 = inventory2.dictionary.entries();
        for(let item of iterator1){
            this.dictionary.set(item[0], this.dictionary.get(item[0]) - item[1]);
        }
    }

    toString(){
        var inventoryString = "";
        var iterator1 = this.dictionary.entries();
        for(let item of iterator1){
            inventoryString += item[1] + " " + item[0] + " / ";
        }
        if(inventoryString.length == 0){
            return "- none -";
        }
        return inventoryString.substr(0, inventoryString.length - 3);
    }
}

class Building{
    constructor(name, defense, maxLevel, ressourcesRequired, timeRequired, actionFonction){
        this.name = name;
        this.defense = defense;
        this.level = 0;
        this.maxLevel = maxLevel;
        this.ressourcesRequired = ressourcesRequired;
        this.timeRequired = timeRequired;
        this.actionFonction = actionFonction;
        this.isDiscovered = true;
    }

    action(myCity){
        actionFonction(myCity);
    }

    build(myCity){
        if(this.isBuildable(myCity)){
            this.level++;
            myCity.inventory.minus(this.ressourcesRequired);
            //ressources saver skill
            var ressourceSaverSkill = UsefulFunctions.searchObjetInArray("ressources saver", myCity.skills);
            var ressourcesSaved = new Inventory();
            var iterator1 = this.ressourcesRequired.dictionary.entries();
            var hasSavedSomething = false
            for(let item of iterator1){
                var itemName = item[0]
                var itemNb = item[1]
                for(let i=0; i<itemNb; i++){
                    var randomNb = Math.random();
                    if(randomNb < ressourceSaverSkill.level/ressourceSaverSkill.maxLevel*maxProbabilityRessourceSaver){
                        hasSavedSomething = true
                        ressourcesSaved.add(itemName, 1)
                    }
                }
            }
            myCity.inventory.addInventory(ressourcesSaved)
            myCity.inventoryUpdate()
            if(hasSavedSomething){
                alert("You manage to save ressources during the construction: \n" + ressourcesSaved.toString())
            }
            //end ressource saver skill
            myCity.addTime(this.getTimeRequired(myCity));
            myCity.addDefense(this.getDefense(myCity));
            myCity.inventoryUpdate();
            myCity.displayBuildAction();
        }
        else{
            var alertMessage = "You can't build this building: \n";
            if(this.level >= this.maxLevel){
                alertMessage += "This building is already reached his maximum level";
            }
            else{
                alertMessage += "You don't have the ressources required to build it";
            }
            alert(alertMessage);
        }
    }

    isBuildable(myCity){
        return myCity.inventory.contains(this.ressourcesRequired) && this.level < this.maxLevel;
    }

    toString(){
        return "" + this.name + " " + this.defense + " " + this.level + " " + this.maxLevel;
    }

    getTimeRequired(myCity){
        var builderSkill = UsefulFunctions.searchObjetInArray("builder", myCity.skills);
        var realTimeRequired = this.timeRequired - 0.5*this.timeRequired*(builderSkill.level/builderSkill.maxLevel);
        return realTimeRequired;
    }

    getDefense(myCity){
        return this.defense;
    }
}

class UsefulFunctions{
    static allRessourcesRequiredBuildings(){
        var allRessourcesInventory = new Inventory();
        var numberOfBuildings = listBuildings.length;
        for(let i = 0; i < numberOfBuildings; i++){
            var building = listBuildings[i];
            allRessourcesInventory.addInventory(building.ressourcesRequired);
        }
        return allRessourcesInventory;
    }

    static probabilityPerItemArray(){
        var probabilityArray = [];
        var allRessourcesInventory = UsefulFunctions.allRessourcesRequiredBuildings();
        var nb = allRessourcesInventory.numberOfItems();
        var iterator1 = allRessourcesInventory.dictionary.entries();
        for(let item of iterator1){
            probabilityArray.push({name: item[0], probability: item[1]/nb});
        }
        return probabilityArray;
    }

    static probabilityCumulatedPerItemArray(){
        var probabilityCumulatedArray = [];
        var probabilityArray = UsefulFunctions.probabilityPerItemArray();
        var lenProbabilityArray = probabilityArray.length;
        var item = probabilityArray[0];
        probabilityCumulatedArray.push({name:item.name, cumulatedProbability:item.probability})
        for(let i = 1; i < lenProbabilityArray; i++){
            var item = probabilityArray[i];
            probabilityCumulatedArray.push({
                name:item.name, 
                cumulatedProbability:probabilityCumulatedArray[probabilityCumulatedArray.length-1].cumulatedProbability + item.probability
            })
        }
        return probabilityCumulatedArray;
    }

    static randomItem(){ // return the name of the item (string)
        var probabilityCumulatedArray = UsefulFunctions.probabilityCumulatedPerItemArray();
        var rd = Math.random();
        var lenProbabilityCumulatedArray = probabilityCumulatedArray.length;
        var i = 0;
        while(i < lenProbabilityCumulatedArray && rd > probabilityCumulatedArray[i].cumulatedProbability){
            i++;
        }
        if(i == lenProbabilityCumulatedArray){
            return probabilityCumulatedArray[i-1].name;
        }
        else{
            return probabilityCumulatedArray[i].name;
        }
    }

    static dayTimeToString(time){
        var hours = Math.trunc(time / one_hour);
        var minutes = Math.trunc((time - hours*one_hour)/60);
        var timeString;
        var minutesString;
        if(minutes < 10){
            minutesString = "0" + minutes;
        }
        else{
            minutesString = "" + minutes;
        }

        if(hours < 12){
            timeString =  "" + hours + ":" + minutesString + "am";
        }
        else if (hours < 24){
            hours = hours - 12;
            timeString =  "" + hours + ":" + minutesString + "pm";
        }
        //alert("" + time + " " + hours + " " + minutesString);
        return timeString;
    }

    static timeToString(time){
        var hours = Math.trunc(time / one_hour);
        var minutes = Math.trunc((time - hours*one_hour)/60);
        var timeString;
        var minutesString;
        if(minutes < 10){
            minutesString = "0" + minutes;
        }
        else{
            minutesString = "" + minutes;
        }

        if(hours < 12){
            timeString =  "" + hours + "h" + minutesString;
        }
        else if (hours < 24){
            hours = hours - 12;
            timeString =  "" + hours + "h" + minutesString;
        }
        //alert("" + time + " " + hours + " " + minutesString);
        return timeString;
    }



    static randomBob(){
        var rdnb = Math.random();
        var lenBobList = listBobs.length;
        for(let i = 0; i < lenBobList; i++){
            var bob = listBobs[i];
            if(rdnb<=(i+1)/lenBobList){
                return bob.name;
            }
        }
    }

    static searchObjetInArray(objetName, array){
        var lenArray = array.length;
        for(let i = 0; i < lenArray; i++){
            var objet = array[i];
            if(objetName == objet.name){
                return objet;
            }
        }
        alert("bug: objet not in array");
    }

    static showHideDevFunctions(){
        hidden = !hidden;
        if(hidden) {
            var x = document.getElementsByClassName("devFunction");
            for(let i = 0; i < x.length; i++){
                x[i].style.display = 'none';
            }
        } 
        else {
            var x = document.getElementsByClassName("devFunction");
            for(let i = 0; i < x.length; i++){
                x[i].style.display = 'block';
            }
        }
    }

    static getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    }

    static trunc100(floatNumber){
        return Math.trunc(floatNumber*100)/100;
    }
}

class Skill {
    constructor(name, maxLevel, timeRequired){
        this.name = name;
        this.level = 0;
        this.maxLevel = maxLevel;
        this.timeRequired = timeRequired;
    }

    isUpgradable(){
        return this.level < this.maxLevel;
    }

    upgrade(myCity){
        this.level++;
        myCity.addTime(this.getTimeRequired(myCity));
    }

    getTimeRequired(myCity){
        var fastLearnerSkill = UsefulFunctions.searchObjetInArray("fast learner", myCity.skills);
        var realTimeRequired = this.timeRequired - myCity.fastLearnerSkillAdvantage*this.timeRequired*(fastLearnerSkill.level/fastLearnerSkill.maxLevel);
        return realTimeRequired;
    }
}

class Bob {
    constructor(name, nb){
        this.name = name;
        this.nb = nb;
    }

    add(nb){
        this.nb += nb;
    }
}

class DiggerBob extends Bob{
    constructor(nb){
        super("diggerBob", nb)
    }

    singleBobAction(myCity){
        var item = UsefulFunctions.randomItem();
        myCity.addItem(item, 1);
        return item;
    }

    action(myCity){ 
        var itemFoundInventory = new Inventory();
        for(let i=0; i<this.nb; i++){
            itemFoundInventory.add(this.singleBobAction(myCity), 1);
        }
        return "the diggerBobs have found: " + itemFoundInventory.toString();
    }
}

class BricoBob extends Bob{
    constructor(nb){
        super("bricoBob", nb)
    }

    singleBobAction(myCity){
        myCity.addDefense(bricoBob_defense);
        return bricoBob_defense
    }

    action(myCity){
        var totalBricoBobDefense = 0;
        for(let i=0; i<this.nb; i++){
            totalBricoBobDefense += this.singleBobAction(myCity);
        }
        return "the bricoBobs have upgraded your defense by: " + totalBricoBobDefense
    }
}

class StupidBob extends Bob{
    constructor(nb){
        super("stupidBob", nb);
    }

    singleBobAction(myCity){
        var item = UsefulFunctions.randomItem();
        if(myCity.inventory.containsItem(item)){
            myCity.addItem(item, -1);
            return item;
        }
        else{
            return undefined;
        }
    }

    action(myCity){
        var itemLostInventory = new Inventory();
        for(let i=0; i<this.nb; i++){
            var lostObject = this.singleBobAction(myCity)
            if(lostObject != undefined){
                itemLostInventory.add(lostObject, 1);
            }
        }
        return "the stupidBobs have lost: " + itemLostInventory.toString();
    }
}




listBuildings = []

//palisade
name = "palisade";
defense = 25;
maxLevel = 3;
ressourcesRequiredPalisade = new Inventory();
ressourcesRequiredPalisade.add("wood", 2);
ressourcesRequiredPalisade.add("metal", 3);
ressourcesRequiredPalisade.add("screw", 1);
timeRequired = 3600*2;
actionFonction = undefined;
palisade = new Building(name, defense, maxLevel, ressourcesRequiredPalisade, timeRequired, actionFonction);
listBuildings.push(palisade);

//huge pit
name = "huge pit";
defense = 15;
maxLevel = 4;
ressourcesRequiredHugePit = new Inventory();
timeRequired = 3600*5;
actionFonction = undefined;
hugePit = new Building(name, defense, maxLevel, ressourcesRequiredHugePit, timeRequired, actionFonction);
listBuildings.push(hugePit);

//giant wall
name = "giant wall";
defense = 40;
maxLevel = 2;
ressourcesRequiredGiantWall = new Inventory();
ressourcesRequiredGiantWall.add("wood", 5);
ressourcesRequiredGiantWall.add("metal", 5);
ressourcesRequiredGiantWall.add("screw", 2);
timeRequired = 3600*3;
actionFonction = undefined;
giantWall = new Building(name, defense, maxLevel, ressourcesRequiredGiantWall, timeRequired, actionFonction);
listBuildings.push(giantWall);



//city inventory
ressources = new Inventory();
ressources.add("wood", 0);
ressources.add("metal", 0);
ressources.add("screw", 0);


//listSkills
listSkills = [];

name = "digger";
maxLevel = 5;
timeRequired = 4*3600;
diggerSkill = new Skill(name, maxLevel, timeRequired);
listSkills.push(diggerSkill);

name = "builder";
maxLevel = 5;
timeRequired = 4*3600;
builderSkill = new Skill(name, maxLevel, timeRequired);
listSkills.push(builderSkill);

name = "ressources saver";
maxLevel = 5;
timeRequired = 4*3600;
ressourcesSaverSkill = new Skill(name, maxLevel, timeRequired);
listSkills.push(ressourcesSaverSkill);

name = "fast learner";
maxLevel = 5;
timeRequired = 4*3600;
ressourcesFastLearner = new Skill(name, maxLevel, timeRequired);
listSkills.push(ressourcesFastLearner);


listBobs = [];
listBobs.push(new DiggerBob(0))
listBobs.push(new BricoBob(0))
listBobs.push(new StupidBob(0))

var hidden = true;
var myCity = new City();
console.log(myCity)

