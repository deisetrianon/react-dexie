import Dexie from "dexie";

const db = new Dexie("ReactDexie");
db.version(1).stores({
    posts: "title, content, file"
});

export default db;
