import { makeAutoObservable } from "mobx";
import { randomNumber } from "../components/helpers";
import SkillScreen from "../components/craftingSkills/SkillScreen";

class SkillStore {
    allStores;

    //Skills
    prefixNum = 1;
    prefix;
    // skillItems;

    //Tanning
    tanningActive = false;
    setTanInterval;
    tanTime;
    tanningProgressState = 0;
    rawHide = {};

    constructor(store) {
        this.allStores = store;
        makeAutoObservable(this);
    }

    skillScreen = (skillName) => {
        if (this.allStores.heroActionStore.selectedActionArea !== <SkillScreen />) {
            this.allStores.heroActionStore.selectedActionArea = (
                <SkillScreen skillName={skillName} level={this.allStores.countStore.tanningLevel} />
            );
        }
    };

    tanning = (hide) => {
        if (this.tanningActive === true) {
            console.log("Tanning already in progress!");
        } else if (hide.skill !== "tannable") {
            console.log("Can't tan this!");
        } else {
            this.tanningActive = true;
            this.rawHide = hide;
            this.tanTime = hide.hideDiff / this.allStores.countStore.tanningLevel;
            this.tanInterval();
            hide.count--;
            this.allStores.heroInventoryStore.inventoryCheck();
            this.skillScreen();
        }
        console.log("hide", hide);
    };

    tanInterval = () => {
        this.setTanInterval = setInterval(this.tanningProgress, 1000);
    };

    tanningProgress = (action) => {
        if (this.tanningActive === false) {
            console.log("Nothing to tan");
        } else if (this.tanningProgressState >= this.tanTime - 1 && this.tanningActive === true) {
            this.tanningComplete();
            clearInterval(this.setTanInterval);
        } else if (action === "click") {
            this.tanningProgressState += this.allStores.countStore.tanningLevel;
        } else {
            this.tanningProgressState++;
        }
    };

    tanningComplete = () => {
        const tanChance = this.rawHide.hideDiff - this.allStores.countStore.tanningLevel;
        const numberGen = randomNumber(0, tanChance);
        if (numberGen <= 40) {
            this.prefixNum++;
        }
        if (numberGen <= 30) {
            this.prefixNum++;
        }
        if (numberGen <= 20) {
            this.prefixNum++;
        }
        if (numberGen <= 10) {
            this.prefixNum++;
        }
        if (numberGen <= 5) {
            this.prefixNum++;
        }
        //Gets the correct prefix
        if (this.prefixNum === 6) {
            this.prefix = "Mythic ";
        } else if (this.prefixNum === 5) {
            this.prefix = "Perfect ";
        } else if (this.prefixNum === 4) {
            this.prefix = "Superb ";
        } else if (this.prefixNum === 3) {
            this.prefix = "Good ";
        } else if (this.prefixNum === 2) {
            this.prefix = "Normal ";
        } else {
            this.prefix = "Damamged ";
        }
        let tannedHide = {
            prefix: this.prefix,
            name: this.prefix + this.rawHide.name,
            cost: this.rawHide.cost * +this.prefixNum,
            stack: this.rawHide.stack,
            type: this.rawHide.type,
            amount: this.rawHide.amount ? this.rawHide.amount : 1,
            icon: this.rawHide.tannedIcon,
            count: 1,
            skill: "none",
            id: Math.random().toString(36),
        };
        this.prefixNum = 0;
        this.tanningActive = false;
        this.tanningProgressState = 0;
        this.allStores.heroInventoryStore.inventoryPlacement(tannedHide);
        this.allStores.countStore.skillExperienceIncrease("tanning", this.rawHide.xp);
    };
}

export default SkillStore;
