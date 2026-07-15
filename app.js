require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./db")
const morgan = require("morgan");
const cors = require("cors");

const validator  = require("validator");


const Task = require("./models/tasks");


app.use(express.json());
app.use(morgan("dev"));
app.use(cors());



app.get("/api/tasks", async (req, res, next) => {
    try {
        const tasks = await Task.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        });

        res.json(tasks);

    } catch (err) {

        next(err);
    }
})



app.get("/api/tasks/:id", async (req, res, next) => {
    try {

        const id = req.params.id;

        if(!validator.isUUID(id, 4)) {
            return res.status(400).json({error: "id has to be a valid UUID v4"});
        }

        const task = await Task.findByPk(id, {
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        });

        if(!task) {
            return res.status(404).json({error: "I mean no task with that id"});
        }

        res.status(200).json(task);
    
    } catch(err) {
        
        next(err);
    }
})



app.post("/api/tasks", async (req, res, next) => {
    try {
        const { title, completed } = req.body;

        if(title === undefined || typeof title !== "string" || title.length < 2 || title.length > 200 || title.trim() === "") {
            return res.status(400).json({error: "title has to be valid string"});
        }

        if(completed !== undefined && typeof completed !== "boolean") {
            return res.status(400).json({error: "completed has to be either true or false"});
        }

        const taskObj = { title };

        if(completed !== undefined) taskObj.completed = completed;

        const createdObj = await Task.create(taskObj);

        res.status(201).json(createdObj);

    } catch(err) {

        next(err);
    }
})



app.delete("/api/tasks/:id", async (req, res, next) => {
    try {
        
        const id = req.params.id;

        if(!validator.isUUID(id, 4)) {
            return res.status(400).json({error: "id has to be a valid UUID v4"});
        }

        const deleted = await Task.destroy({
            where: {
                id
            }
        }) 

        if(deleted === 0) {
            return res.status(404).json({error: "Could not find task with that id to delete"});
        }

        res.sendStatus(204)

    } catch(err) {

        next(err);
    }
})



app.use((err, req, res, next) => {

    res.status(500).json({error: "Something went wrong"});
})

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await db.authenticate();
        console.log("Database connected");

        // Creates the table if it does not exist
        await db.sync();

        const taskCount = await Task.count();

        // Only add the initial tasks when the table is empty
        if (taskCount === 0) {
            await Task.bulkCreate([
                {
                    title: "take out the garbage",
                    completed: true
                },
                {
                    title: "take the dog outside",
                    completed: false
                },
                {
                    title: "go to doctor, daily checkup",
                    completed: false
                },
                {
                    title: "cook dinner",
                    completed: false
                }
            ]);

            console.log("Initial tasks added");
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Startup error:", err);
    }
}

startServer();