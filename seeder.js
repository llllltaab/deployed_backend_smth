const db = require("./db");
const Task = require("./models/tasks");


const seederFun = async () => {
    try {
        await db.sync({ force: true });

        await Task.bulkCreate([
            {
                title: "take out the garbage",
                completed: true
            },

            {
                title: "take the dog outside"
            }, 

            {
                title: "go to doctor, daily checkup"
            },

            {
                title: "cook dinner",
                completed: false
            }
        ])

    } catch (err) {
        console.error(err);

    } finally {
        db.close()
    }
}

seederFun()