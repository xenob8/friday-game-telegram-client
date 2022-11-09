export type SceneState = {
    hasName? : boolean
}

const obj:object = {}
const obj2 = obj as SceneState
console.log(obj2)
if (obj2.hasName) console.log("Dfdf")