import express from 'express';
import { Sequelize , QueryTypes } from "sequelize";
import dotenv from 'dotenv';
import bodyParser from "body-parser";

const jsonParser = bodyParser.json();

dotenv.config();

const app = express();
const port = 8080;

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: "mysql",
        logging: false
    }
);

app.get('/getdata/:id', jsonParser, async (req, res) => {

    try {
        const key = req.params.id;
        const currDateTime = new Date();

        const data = await sequelize.query
        (
            `
                SELECT *
                FROM Store
                WHERE
                    \`key\` = :id
                    AND
                    expiresAt > :currDateTime;
            `,
            {
                replacements: {
                    id: key,
                    currDateTime: currDateTime,
                },
                type: QueryTypes.SELECT,
            }
        )

        const resp = {};


        if (data.length === 0) {
            return res
                .status(200)
                .json('No data');
        }

        data.forEach((data) => {
            resp[data.key] = data.value;
        })

        return res
            .status(200)
            .json(resp);


    } catch (err) {
        console.error('Error:', err);
        return res
            .status(500)
            .json('Server error');
    }
})

app.post('/addData', jsonParser, async (req, res) => {
    try {
        console.log(req.body);

        const key = req.body.key;
        const value = req.body.value;
        //const { key, value } = req.body;

        const postData = await sequelize.query(
            `
                REPLACE
                INTO  Store
                    (\`key\`, value, expiresAt)
                VALUES
                    (:key, :value, :expiresAt);
            `,
            {
                replacements: {
                    key,
                    value,
                    expiresAt: new Date(Date.now() + 600000) // 10 min
                },
                type: QueryTypes.INSERT,
            }
        )

        console.log(postData);

        return res.status(201).json('Data added successfully');

    } catch (err) {
        console.log("Error:", err);
        return res
            .status(500)
            .json('Server error');
    }
})

app.delete('/deleteData/:id', jsonParser, async (req, res) => {
    try {
        const key = req.params.id;

        //Soft deleting it
        const deleteData = await sequelize.query(
            `
                UPDATE Store
                SET
                    expiresAt = null
                WHERE
                    \`key\` = :id;
            `,
            {
                replacements: {
                    id: key,
                },
                type: QueryTypes.DELETE,
            }
        )

        console.log(deleteData);

        return res.status(200).json("Data delete successfully");

    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json('Server error');
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});