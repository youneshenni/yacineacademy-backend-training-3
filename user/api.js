import { Router } from 'express';
import {
    readFileSync, existsSync, writeFileSync, appendFileSync
} from 'fs';
import Logger from '../util/log/winston.js';
import parseCsv from '../util/csvToJson.js';
import AutoIncrementer from '../util/autoincrement/autoincrement.js';

const usersRouter = Router();

usersRouter.post('', (req, res) => {
    if (!req.body.nom || !req.body.prenom || !req.body.email) {
        Logger.error(`Missing fields`);
        res.status(400).send('Missing fields');
        return;
    }
    if (!existsSync("./data.csv"))
        writeFileSync("./data.csv", "ID,Nom,Prénom,Email");
    const autoIncrementer = new AutoIncrementer("users");
    const newRowId = autoIncrementer.increment();
    const appendedLine = `\n${newRowId},${req.body.nom},${req.body.prenom},${req.body.email}`;
    const users = parseCsv(readFileSync("./data.csv").toString() + appendedLine);
    appendFileSync(
        "./data.csv",
        appendedLine
    );
    Logger.info(req.body);

    console.log()

    res.status(200).render('users', { users });
})


usersRouter.get("", (req, res) => {
    if (!existsSync("./data.csv"))
        writeFileSync("./data.csv", "ID,Nom,Prénom,Email");
    const csvBuffer = readFileSync("./data.csv");
    res.status(200).render('users', { users: parseCsv(csvBuffer.toString()) });
});

usersRouter.delete('/:id', (req, res) => {
    const id = req.params.id;
    const users = parseCsv(readFileSync("./data.csv").toString());
    const filteredUsers = users.filter(user => user.ID !== id);
    writeFileSync("./data.csv", "ID,Nom,Prénom,Email");
    filteredUsers.forEach(user => {
        appendFileSync("./data.csv", `\n${user.ID},${user.Nom},${user.Prénom},${user.Email}`);
    });
    res.status(200).send('OK');
})

usersRouter.get('/:id', (req, res) => {
    const id = req.params.id;
    const users = parseCsv(readFileSync("./data.csv").toString());
    const user = users.find(user => user.ID === id);
    res.status(200).json(user);
});

usersRouter.put('/:id', (req, res) => {
    const id = req.params.id;
    const users = parseCsv(readFileSync("./data.csv").toString());
    const userIndex = users.findIndex(user => user.ID === id);
    if (userIndex === -1) {
        res.status(404).send('User not found');
        return;
    }
    users[userIndex] = {
        ID: id,
        Nom: req.body.nom,
        Prénom: req.body.prenom,
        Email: req.body.email
    };
    writeFileSync("./data.csv", "ID,Nom,Prénom,Email");
    users.forEach(user => {
        appendFileSync("./data.csv", `\n${user.ID},${user.Nom},${user.Prénom},${user.Email}`);
    });
    res.status(200).send("OK");
});
export default usersRouter;
