const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

async function startServer() {
    try {
        await client.connect();

        console.log("MongoDB connected successfully!");

        // Select database
        const db = client.db("chakshu_foundation");

        // Select collection
        const appointments = db.collection("appointments");

        // Test route
        app.get("/", (req, res) => {
            res.send("Chakshu Foundation backend is running!");
        });

        // Appointment API
        app.post("/api/appointments", async (req, res) => {
            try {
                const appointment = {
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    mode: req.body.mode,
                    preferredTime: req.body.preferredTime,
                    message: req.body.message,
                    createdAt: new Date()
                };

                const result = await appointments.insertOne(appointment);

                res.status(201).json({
                    success: true,
                    message: "Appointment request saved successfully!",
                    id: result.insertedId
                });

            } catch (error) {
                console.error("Error saving appointment:", error);

                res.status(500).json({
                    success: false,
                    message: "Failed to save appointment"
                });
            }
        });

        const PORT = 5000;

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}

startServer();