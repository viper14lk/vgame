import { useRootStore } from "../../provider/RootStoreProvider";
import { observer } from "mobx-react";
import trees from "../monsters/trees.json";

const SkillObjectChoice = () => {
    const {
        skillStore: { skillProgress, skillTime, skillProgressState, activeSkilling, skillTypeName, skillName },
    } = useRootStore();

    const {
        countStore: { woodCutting },
    } = useRootStore();

    const LocationText = () => {
        if (skillName === "woodCutting") {
            return "Choose your trees";
        }
    };

    const treeSelection = trees.filter((tree) => tree.level <= woodCutting.level);

    const skillItems = treeSelection.map((tree) => (
        <div key={Math.random().toString(36)} className="HeroInventory__equipment">
            <div key={Math.random().toString(36)} className="HeroInventory__equipmentName">
                {tree.name}
            </div>
            <img className="HeroInventory__image" src={tree.icon} alt="icon" />
            <div className="HeroInventory__buttonContainer">
                <button key={Math.random().toString(36)} onClick={() => activeSkilling(tree)}>
                    Choose
                </button>
            </div>
        </div>
    ));

    return (
        <div className="SkillObjectChoice__container">
            <div className="SkillObjectChoice__header">{skillTypeName}</div>
            <div className="SkillObjectChoice__description">
                <LocationText />
            </div>
            <div className="SkillObjectChoice__choiceContainer">
                <div className="SkillObjectChoice__choice">{skillItems}</div>
            </div>
        </div>
    );
};

export default observer(SkillObjectChoice);
