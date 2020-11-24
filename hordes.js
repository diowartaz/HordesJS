init_defense = 20;
init_nbZombie = 10;
init_day = 1;
one_hour = 3600; //seconds
day_start_time = one_hour*6; //the day begins at 6am
day_end_time = one_hour*22; //the day ends at 10pm
bricoBob_defense = 5;
diggingInTheCityProba = 0.5;

//Skills
ressourcesSaverSkillAdvantage = 0.25;
fastLearnerSkillAdvantage = 0.5;
sprinterSkillAdvantage = 0.5;
diggerSkillAdvantage = 0.25;

//times
defaultDiggingTime = one_hour*1;
defaultJoiningDiggingZoneTime = one_hour*1;
napTime = one_hour*3.75;






class City{
    constructor(){
      this.defense = init_defense;
      this.nbZombie = init_nbZombie;

      this.inventory = ressources;
      this.buildings = listBuildings;
      this.buildingsArchitect = listBuildingsArchitect;
      this.listAllBuildings = listAllBuildings;
      this.discoveryArchitect(3, 1, false);


      this.day = init_day;
      this.day_end_time = day_end_time;
      this.day_start_time = day_start_time;
      this.time = this.day_start_time; //seconds (6:00 am)

      this.effectiveTime = 0;

      this.bobs = listBobs;
      this.skills = listSkills;
      this.skillsLibrary = listSkillsLibrary;
      this.listAllSkills = listAllSkills;
      this.discoveryLibrary(2, 1, false);

      this.locationCity = true;

      this.defaultDiggingTime = defaultDiggingTime;
      this.defaultJoiningDiggingZoneTime = defaultJoiningDiggingZoneTime;
      this.napTime = napTime;
      this.diggingInTheCityProba = diggingInTheCityProba;

      this.currentActionDisplay = "building";
    }


    fullRessourcesInventory(){
        var cheatInventory = new Inventory();
        cheatInventory.addInventory(this.inventory)
        cheatInventory.cheat(100);

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


    getJoiningDiggingZoneTime(){
        return JoiningDiggingZoneTime;
    }

    findAnItem(){
        var anItemHasBeenFound = true;
        if(this.locationCity){
            anItemHasBeenFound = UsefulFunctions.probaFunction(this.diggingInTheCityProba);
        }
        if(anItemHasBeenFound){
            var itemName = UsefulFunctions.randomItem();
            this.addItem(itemName, 1);
        }
        this.addTime(this.getTimeRequiredDigging());     
        myCity.displayDiggingAction();  
    }

    onLoadBody(){
        this.update();
        this.permanentlyUpdating(0);
    }

    timeUpdate(){
        var timeString;
        var timeDisplay = document.getElementById("time");
        var attentionDisplays = document.getElementsByClassName("attentionTime");

        if(this.day_end_time - 2*one_hour < this.time){
            for(let i = 0; i < attentionDisplays.length; i++){
                attentionDisplays[i].innerHTML = " /!\\ ";
                attentionDisplays[i].style.color = "red";
            }
        }
        else{
            for(let i = 0; i < attentionDisplays.length; i++){
                attentionDisplays[i].innerHTML = "";
                attentionDisplays[i].style.color = "aliceblue";
            }
        }
        if(this.time < this.day_end_time){
            timeString = UsefulFunctions.dayTimeToString(this.time);
            timeDisplay.innerHTML = timeString;
        }
        else{
            this.midnightAttack();
        }
    }


    permanentlyUpdating(ms){
        var periodMs = 50 //ms
        var timeAdded = 25 //sec
        this.addUselessTime(timeAdded);//real game speed, les 16h d une journee correspondent environ a 2min
        /*if(ms==500){
            ms = 0;
            myCity.updateActionDisplay();
        }*/
        setTimeout(function(myCity,ms){myCity.permanentlyUpdating(ms);}, periodMs, this, ms+periodMs);//ms+periodMs
    }

    dayUpdate(){
        document.getElementById("day").innerHTML = this.day;
    }
    nbZombieUpdate(){
        this.defenseZombieUpdate();
    }

    defenseUpdate(){
        this.defenseZombieUpdate();
    }

    defenseZombieUpdate(){
        var defenseZombieDisplay = document.getElementsByClassName("defenseZombieDisplay");
        var infSupDisplay = document.getElementById("infSup");
        var attentionDisplays = document.getElementsByClassName("attentionZombie");
        document.getElementById("nbZombie").innerHTML = this.nbZombie;
        document.getElementById("defense").innerHTML = this.defense;

        if(this.nbZombie > this.defense){
            infSupDisplay.innerHTML = " < ";
            for(let i = 0; i < attentionDisplays.length; i++){
                attentionDisplays[i].innerHTML = " /!\\ ";
                attentionDisplays[i].style.color = "red";
            }
        }
        else{
            infSupDisplay.innerHTML = " >= ";
            for(let i = 0; i < attentionDisplays.length; i++){
                attentionDisplays[i].innerHTML = "";
                attentionDisplays[i].style.color = "aliceblue";
            }
        }
    }

    inventoryUpdate(){
        document.getElementById("inventory").innerHTML = this.inventory.toHtml();
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
        this.displayBuildAction();
        UsefulFunctions.showHideDevFunctions();

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
        this.time = this.day_start_time;
        this.effectiveTime = 0;
        this.timeUpdate();
    }
    nbZombieToAdd(){
        return UsefulFunctions.getRandomIntInclusive(this.day*2,this.day*4);
    }

    midnightAttack(){
        //bob actions
        if(this.locationCity){
            var stringActionBobs = "Bob actions during the day:\n";
            for(let i = 0; i < this.bobs.length; i++){
                var stringActionResult = this.bobs[i].action(this);
                stringActionBobs += stringActionResult + "\n"
            }
            alert(stringActionBobs)

            var efficacity = Math.trunc((this.effectiveTime / (this.day_end_time - this.day_start_time))*100)
            alert("The attack is happening! \ndefense = " + this.defense + "\nnbZombie = " + this.nbZombie + "\nday efficacity = " + efficacity + "%");
            if(this.nbZombie > this.defense){
                alert("You haven't survived... \nYour score: day " + this.day);
                window.location.href="gameLostHordes.html";
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
            this.midnightDiscoveryArchitect(1, 1, true);
            this.midnightDiscoveryLibrary(1, 1, true);
            this.displayBuildAction();
        }
        else{//night in the desert
            alert("You haven't survived.\nWho thought that spending a night in the desert full of zombies was dangerous?\nWhat a mistake!\nYou survived the first " + this.day + " day(s).");
            window.location.href="gameLostHordes.html";
        }
    }

    takeANap(){
        this.addUselessTime(this.napTime);
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
            htmlString += "<th>" + UsefulFunctions.buttonConstructor("+", "myCity.build(" + i + ")", !building.isBuildable(this)) + "<th>";
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
            htmlString += "<th>" + UsefulFunctions.buttonConstructor("+", "myCity.upgradeSkill(" + i + ")", !skill.isUpgradable(this)) + "<th>";
            htmlString += "</tr>";
        }
        htmlString = htmlString + "</table>";
        return htmlString;
    }

    diggingActionToHtml(){
        //youHaveTimeToDothisAction(timeRequired)
        if(this.locationCity){
            var htmlString = "<table>";

            htmlString += "<tr>";
            htmlString = htmlString + "<th>Join digging zone in the desert<th>"
            htmlString += "<th>" + UsefulFunctions.timeToString(this.getTimeRequiredJoiningDiggingZone(this)) + "<th>";
            htmlString += "<th>" + UsefulFunctions.buttonConstructor("+", "myCity.changeLocation()", !this.youHaveTimeToDothisAction(this.getTimeRequiredJoiningDiggingZone(this))) + "<th>";
            htmlString += "</tr>";

            htmlString += "<tr>";
            htmlString = htmlString + "<th>Dig for an item in the city<th>"
            htmlString += "<th>" + UsefulFunctions.timeToString(this.getTimeRequiredDigging(this)) + "<th>";
            htmlString += "<th>" + UsefulFunctions.buttonConstructor("+", "myCity.findAnItem()", !this.youHaveTimeToDothisAction(this.getTimeRequiredDigging(this))) + "<th>";
            htmlString += "</tr>";

            htmlString = htmlString + "</table>";
        }
        else{ // locationCity = digging zone
            var htmlString = "<table>";

            htmlString += "<tr>";
            htmlString = htmlString + "<th>Return to the city<th>"
            htmlString += "<th>" + UsefulFunctions.timeToString(this.getTimeRequiredJoiningDiggingZone(this)) + "<th>";
            htmlString += "<th>" + UsefulFunctions.buttonConstructor("+", "myCity.changeLocation()", !this.youHaveTimeToDothisAction(this.getTimeRequiredJoiningDiggingZone(this))) + "<th>";
            htmlString += "</tr>";

            htmlString += "<tr>";
            htmlString = htmlString + "<th>Dig for an item<th>"
            htmlString += "<th>" + UsefulFunctions.timeToString(this.getTimeRequiredDigging(this)) + "<th>";
            htmlString += "<th>" + UsefulFunctions.buttonConstructor("+", "myCity.findAnItem()", !this.youHaveTimeToDothisAction(this.getTimeRequiredDigging(this))) + "<th>";
            htmlString += "</tr>";

            htmlString = htmlString + "</table>";
        }
        return htmlString;
    }

    getTimeRequiredJoiningDiggingZone(){
        var sprinterSkill = UsefulFunctions.searchObjetInArray("sprinter", myCity.skills, myCity.listAllSkills);
        var realTimeRequired = this.defaultJoiningDiggingZoneTime*(1 - sprinterSkillAdvantage*(sprinterSkill.level/sprinterSkill.maxLevel));
        return realTimeRequired;
    }

    getTimeRequiredDigging(){
        var diggerSkill = UsefulFunctions.searchObjetInArray("digger", myCity.skills, myCity.listAllSkills);
        var realTimeRequired = this.defaultDiggingTime*(1 - diggerSkillAdvantage*(diggerSkill.level/diggerSkill.maxLevel));
        return realTimeRequired;
    }

    changeLocation(){
        this.locationCity = !this.locationCity;
        this.addTime(this.getTimeRequiredJoiningDiggingZone());
        this.displayDiggingAction();
        if(this.locationCity){
            var actionButtons = document.getElementsByClassName("actionButton");
            for(let i = 0; i < actionButtons.length; i++){
                actionButtons[i].disabled = false;
                actionButtons[i].style.background = "transparent";
            }
        }
        else{
            var actionButtons = document.getElementsByClassName("actionButton");
            for(let i = 0; i < actionButtons.length; i++){
                actionButtons[i].disabled = true;
            }
        }
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
        var bob = UsefulFunctions.searchObjetInArray(bobName, this.bobs, []);
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
        this.skills[i].upgrade(this);
        this.timeUpdate();
        this.displayUpgradeSkillsAction();
    }
    
    

    displayBuildAction(){
        document.getElementById("actionDisplay").innerHTML = this.buildingsActionToHtml();
        this.currentActionDisplay = "building";
    }

    displayUpgradeSkillsAction(){
        document.getElementById("actionDisplay").innerHTML = this.skillsActionToHtml();
        this.currentActionDisplay = "skill";
    }

    displayDiggingAction(){
        document.getElementById("actionDisplay").innerHTML = this.diggingActionToHtml();
        this.currentActionDisplay = "digging";
    }
    
    build(i){ //index of the building to build
        this.buildings[i].build(this);
    }

    bobArrival(){
        var bobname = UsefulFunctions.randomBob();
        this.addBob(bobname, 1);
        myCity.bobsUpdate();
    }

    midnightDiscoveryArchitect(nb, proba, alertYes){
        if(UsefulFunctions.searchObjetInArray("architect shelter", this.buildings, []).level == 1){
            this.discoveryArchitect(nb, proba, alertYes);
        }
    }
    midnightDiscoveryLibrary(nb, proba, alertYes){
        if(UsefulFunctions.searchObjetInArray("quiet place", this.buildings, []).level == 1){
            this.discoveryLibrary(nb, proba, alertYes);
        }
    }

    discoveryArchitect(nb, proba, alertYes){

        var additionString = this.itemTransferBetweenTwoArrays(this.buildingsArchitect, this.buildings, nb, proba)
        if(alertYes){
            alert("You are a genius! You manage to create a blueprint which can be really usefull for the defenses\n" + additionString);
        }
    }

    discoveryLibrary(nb, proba, alertYes){
        var additionString = this.itemTransferBetweenTwoArrays(this.skillsLibrary, this.skills, nb, proba)
        if(alertYes){
            alert("You discovered some books with which you could learn some new usefull skills!\n" + additionString);
        }
    }

    itemTransferBetweenTwoArrays(arrayFrom, arrayTo, nb, proba){
        var additionString = "";
        for(let i = 0; i < nb; i++){
            if (UsefulFunctions.probaFunction(proba) && arrayFrom.length > 0){
                var randomObjectIndice = UsefulFunctions.getRandomIntInclusive(0, arrayFrom.length-1);
                var removedItem = arrayFrom.splice(randomObjectIndice, 1)[0];
                arrayTo.push(removedItem);
                additionString = additionString + removedItem.name + "\n";
                
            } 
        }   
        return additionString;
    }

    upgradeCozyHouse(){
        this.day_start_time = this.day_start_time - one_hour*0.5;
        this.day_end_time = this.day_end_time + one_hour*0.5;
    }

    youHaveTimeToDothisAction(timeRequired){
        //console.log("this.time + timeRequired < this.day_end_time:   " + this.time + " + " + timeRequired + " < " + this.day_end_time);
        return this.time + timeRequired < this.day_end_time;
    }

    updateActionDisplay(){
        if(this.currentActionDisplay == "building"){
            this.displayBuildAction();
        }
        else if(this.currentActionDisplay == "skill"){
            this.displayUpgradeSkillsAction();
        }
        else if(this.currentActionDisplay == "digging"){
            this.displayDiggingAction();
        }
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

    cheat(nb){
        var iterator1 = this.dictionary.entries();
        for(let item of iterator1){
            this.add(item[0], nb)
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
    constructor(name, defense, maxLevel, ressourcesRequired, timeRequired, actionFunction){
        this.name = name;
        this.defense = defense;
        this.level = 0;
        this.maxLevel = maxLevel;
        this.ressourcesRequired = ressourcesRequired;
        this.timeRequired = timeRequired;
        this.actionFunction = actionFunction;
        this.isDiscovered = true;
    }

    build(myCity){
        if(this.isBuildable(myCity)){
            this.level++;
            myCity.inventory.minus(this.ressourcesRequired);
            //ressources saver skill
            var ressourceSaverSkill = UsefulFunctions.searchObjetInArray("ressources saver", myCity.skills, myCity.listAllSkills);
            var ressourcesSaved = new Inventory();
            var iterator1 = this.ressourcesRequired.dictionary.entries();
            var hasSavedSomething = false
            for(let item of iterator1){
                var itemName = item[0]
                var itemNb = item[1]
                for(let i=0; i<itemNb; i++){
                    var randomNb = Math.random();
                    if(randomNb < ressourceSaverSkill.level/ressourceSaverSkill.maxLevel*ressourcesSaverSkillAdvantage){
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
            this.actionFunction(myCity);
            myCity.inventoryUpdate();
            myCity.displayBuildAction();
        }
        else{
            alert("Not enough time!")
            /*var alertMessage = "You can't build this building: \n";
            if(this.level >= this.maxLevel){
                alertMessage += "This building is already reached his maximum level";
            }
            else{
                alertMessage += "You don't have the ressources required to build it";
            }*
            alert(alertMessage);*/
        }
    }

    isBuildable(myCity){
        return myCity.inventory.contains(this.ressourcesRequired) && this.level < this.maxLevel && myCity.youHaveTimeToDothisAction(this.timeRequired);
    }

    toString(){
        return "" + this.name + " " + this.defense + " " + this.level + " " + this.maxLevel;
    }

    getTimeRequired(myCity){
        var builderSkill = UsefulFunctions.searchObjetInArray("builder", myCity.skills, myCity.listAllSkills);
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
        var numberOfBuildings = listAllBuildings.length;
        for(let i = 0; i < numberOfBuildings; i++){
            var building = listAllBuildings[i];
            for(let j = 0; j < building.maxLevel; j++){
                allRessourcesInventory.addInventory(building.ressourcesRequired);
            } 
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
        return timeString;
    }

    static probaFunction(proba){
        var rdnb = Math.random();
        return rdnb < proba;
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

    static searchObjetInArray(objetName, array, secondArray){
        var lenArray = array.length;
        for(let i = 0; i < lenArray; i++){
            var objet = array[i];
            if(objetName == objet.name){
                return objet;
            }
        }
        return this.searchObjetInArray(objetName, secondArray, []);
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

    static buttonConstructor(text, onClickFunction, disabled){
        var button;
        if(disabled){
            button = "<button disabled onclick=\"" + onClickFunction + "\">" + text + "</button>";
        }
        else{
            button = "<button onclick=\"" + onClickFunction + "\">" + text + "</button>";
        }
        //console.log(button);
        return button;
    }
}

class Skill {
    constructor(name, maxLevel, timeRequired){
        this.name = name;
        this.level = 0;
        this.maxLevel = maxLevel;
        this.timeRequired = timeRequired;
    }

    isUpgradable(myCity){
        return this.level < this.maxLevel && myCity.youHaveTimeToDothisAction(this.getTimeRequired(myCity));
    }

    upgrade(myCity){
        this.level++;
        myCity.addTime(this.getTimeRequired(myCity));
    }

    getTimeRequired(myCity){
        var fastLearnerSkill = UsefulFunctions.searchObjetInArray("fast learner", myCity.skills, myCity.listAllSkills);
        var realTimeRequired = this.timeRequired - fastLearnerSkillAdvantage*this.timeRequired*(fastLearnerSkill.level/fastLearnerSkill.maxLevel);
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



///////////////////////////////// Buildings /////////////////////////////////////////
// screw - metal - wood - cement bag - adhesive patch - engine - wire mesh

listBuildings = []
listBuildingsArchitect = []
var noActionFunction = function (myCity){};

/*var actionFunction = function (myCity){
    myCity.addDefense(666)
    alert("ajout de " + 666 + " de def");
};*/

//palisade (cout=8 ratio=25/8)
name = "palissade";
defense = 25;
maxLevel = 3;
ressourcesRequired = new Inventory();
ressourcesRequired.add("wood", 2);
ressourcesRequired.add("metal", 3);
ressourcesRequired.add("screw", 1);
timeRequired = one_hour*2;
building = new Building(name, defense, maxLevel, ressourcesRequired, timeRequired, noActionFunction);
listBuildingsArchitect.push(building);

//huge pit (cout=5 ratio=15/5)
name = "huge pit";
defense = 15;
maxLevel = 4;
ressourcesRequired = new Inventory();
timeRequired = one_hour*5;
building = new Building(name, defense, maxLevel, ressourcesRequired, timeRequired, noActionFunction);
listBuildingsArchitect.push(building);

//giant wall (cout=15 ratio=40/15)
name = "giant wall";
defense = 40;
maxLevel = 2;
ressourcesRequired = new Inventory();
ressourcesRequired.add("wood", 5);
ressourcesRequired.add("metal", 5);
ressourcesRequired.add("cement bag", 2);
timeRequired = one_hour*3;
building = new Building(name, defense, maxLevel, ressourcesRequired, timeRequired, noActionFunction);
listBuildingsArchitect.push(building);

//renforced wall (cout=13 ratio=45/13)
name = "renforced wall";
defense = 45;
maxLevel = 3;
ressourcesRequired = new Inventory();
ressourcesRequired.add("metal", 3);
ressourcesRequired.add("cement bag", 4);
ressourcesRequired.add("wire mesh", 2);
timeRequired = one_hour*4;
building = new Building(name, defense, maxLevel, ressourcesRequired, timeRequired, noActionFunction);
listBuildingsArchitect.push(building);

//spinning saw (cout=14 ratio=50/14)
name = "spinning saw";
defense = 50;
maxLevel = 2;
ressourcesRequired = new Inventory();
ressourcesRequired.add("screw", 2);
ressourcesRequired.add("cement bag", 4);
ressourcesRequired.add("adhesive patch", 1);
ressourcesRequired.add("engine", 1);
timeRequired = one_hour*6;
building = new Building(name, defense, maxLevel, ressourcesRequired, timeRequired, noActionFunction);
listBuildingsArchitect.push(building);

//barricade (cout=4 ratio=10/4)
name = "barricade";
defense = 10;
maxLevel = 5;
ressourcesRequired = new Inventory();
ressourcesRequired.add("metal", 1);
ressourcesRequired.add("wood", 2);

timeRequired = one_hour*1;
building = new Building(name, defense, maxLevel, ressourcesRequired, timeRequired, noActionFunction);
listBuildingsArchitect.push(building);

//barbed wire (cout=4 ratio=10/3.5)
name = "barbed wire";
defense = 10;
maxLevel = 5;
ressourcesRequired = new Inventory();
ressourcesRequired.add("metal", 2);
ressourcesRequired.add("wire mesh", 1);
timeRequired = one_hour*0.5;
building = new Building(name, defense, maxLevel, ressourcesRequired, timeRequired, noActionFunction);
listBuildingsArchitect.push(building);

//architect shelter (cout=9)
name = "architect shelter";
defense = 0;
maxLevel = 1;
ressourcesRequired = new Inventory();
ressourcesRequired.add("metal", 2);
ressourcesRequired.add("wood", 1);
ressourcesRequired.add("screw", 2);
timeRequired = one_hour*4;
building = new Building(name, defense, maxLevel, ressourcesRequired, timeRequired, noActionFunction);
listBuildings.push(building);

//quiet place (cout=8.5)
name = "quiet place";
defense = 0;
maxLevel = 1;
ressourcesRequired = new Inventory();
ressourcesRequired.add("cement bag", 2);
ressourcesRequired.add("wood", 2);
ressourcesRequired.add("screw", 1);
timeRequired = one_hour*3.5;
building = new Building(name, defense, maxLevel, ressourcesRequired, timeRequired, noActionFunction);
listBuildings.push(building);

//cozy house (cout=10)
name = "cozy house";
defense = 0;
maxLevel = 3;
ressourcesRequired = new Inventory();
ressourcesRequired.add("cement bag", 2);
ressourcesRequired.add("wood", 2);
ressourcesRequired.add("screw", 2);
timeRequired = one_hour*4.5;

var actionFunction = function (myCity){
    myCity.upgradeCozyHouse();
};
building = new Building(name, defense, maxLevel, ressourcesRequired, timeRequired, actionFunction);
listBuildingsArchitect.push(building);




listAllBuildings = listBuildings.concat(listBuildingsArchitect);



///////////////////////////////// Buildings End /////////////////////////////////////////
//screw - metal - wood - cement bag - adhesive patch - engine - wire mesh
//city inventory
ressources = new Inventory();
ressources.add("wood", 0);
ressources.add("metal", 0);
ressources.add("screw", 0);
ressources.add("cement bag", 0);
ressources.add("adhesive patch", 0);
ressources.add("engine", 0);
ressources.add("wire mesh", 0);

//listSkills
listSkills = [];
listSkillsLibrary = []

name = "digger";
maxLevel = 5;
timeRequired = 5*3600;
diggerSkill = new Skill(name, maxLevel, timeRequired);
listSkillsLibrary.push(diggerSkill);

name = "builder";
maxLevel = 10;
timeRequired = 3*3600;
builderSkill = new Skill(name, maxLevel, timeRequired);
listSkillsLibrary.push(builderSkill);

name = "ressources saver";
maxLevel = 5;
timeRequired = 6*3600;
SaverSkill = new Skill(name, maxLevel, timeRequired);
listSkillsLibrary.push(SaverSkill);

name = "fast learner";
maxLevel = 5;
timeRequired = 4*3600;
FastLearnerSkill = new Skill(name, maxLevel, timeRequired);
listSkillsLibrary.push(FastLearnerSkill);

name = "sprinter";
maxLevel = 5;
timeRequired = 2*3600;
sprinterSkill = new Skill(name, maxLevel, timeRequired);
listSkillsLibrary.push(sprinterSkill);

listAllSkills = listSkillsLibrary.concat(listSkills);


listBobs = [];
listBobs.push(new DiggerBob(0))
listBobs.push(new BricoBob(0))
listBobs.push(new StupidBob(0))

var hidden = false;
var myCity = new City();

