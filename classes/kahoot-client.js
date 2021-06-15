let Kahoot = require('kahoot.js-api');
let client = new Kahoot({
    modules: {
        extraData: true
    }
});
const fetch = require("node-fetch");

class ClientClass {
    constructor() {
        this.QNF = false;
        this.Qid = null;
        this.Qname = "";
        this.PIN = "";
        this.choice = null;
        this.joinedBeforeQuizStarts = false;
        this.totalScore = 0;
        this.playerName = null;
    }

    returnName() {
        return this.playerName;
    }

    async makeChoice(Obj) {
        let Qindex = Obj.index;

        let uri = "https://create.kahoot.it/rest/kahoots/" + this.Qid + "/card/?includeKahoot=true";
        let json = await (await fetch(uri)).json();
        let choice;
        let question = json.kahoot.questions[Qindex];
        let correctAnswers = question.choices;
        if (!question.type.includes("quiz")) return;
        if ((question.type).includes("multiple")) choice = [];
        for (const ans of correctAnswers) {
            if (ans.correct) {
                if ((question.type).includes("multiple")) choice.push(correctAnswers.indexOf(ans))
                else choice = correctAnswers.indexOf(ans)
            }
        }
        this.choice = choice;
    }

    getThis() {
        return this;
    }

    returnNumberFromData(formData) {
        let data = [];
        for (let key of formData.entries()) {
            if (key[0] == "red-input") data.push(0);
            if (key[0] == "blue-input") data.push(1);
            if (key[0] == "yellow-input") data.push(2);
            if (key[0] == "green-input") data.push(3);
        }
        return data;

    }

    async getAnswer() {}

    async getQidFromQname(qname) {
        let uri = `https://create.kahoot.it/rest/kahoots/?query=${qname}&limit=20&cursor=0&searchCluster=20`;
        let json = await (await fetch(uri)).json()

        if (json.totalHits < 1) {
            this.QNF = true
            return false; //Quiz not found.
        } else {
            this.Qid = json.entities[0].card.uuid;
            this.Qname = qname;
            return true;
        }

    }

    async validateQid(Qid) {
        // console.log(Qid)
        // let regEx = new RegExp('[[:alnum:]]{8}-[[:alnum:]]{4}-[[:alnum:]]{4}-[[:alnum:]]{4}-[[:alnum:]]{12}')
        // console.log("why", regEx.test(Qid))
        // if (regEx.exec(Qid) == null) return false;
        let uri = "https://create.kahoot.it/rest/kahoots/" + Qid + "/card/?includeKahoot=true";
        let json = await (await fetch(uri)).json();

        if (json.error) return false;
        return true;
    }

    async updateQid(qid) {
        this.Qid = qid;
        let uri = "https://create.kahoot.it/rest/kahoots/" + qid + "/card/?includeKahoot=true";
        await fetch(uri).then(async res => await res.json()).then(json => {
            this.Qname = json.card.title;
        });
    }

    async validatePIN(PIN) {
        let uri = `https://kahoot.it/reserve/session/${PIN}/`;
        let text = await (await fetch(uri)).text();
        if (text == "Not found") return false;
        return true;
    }

    async join(PIN, NAME) {
        if (client.connected) client = new Kahoot();
        this.PIN = PIN;
        try {
            await client.join(PIN, NAME);
            return false;
        } catch (e) {
            let err = e.description
            return err
        }
    }

    answer(question, choice) {
        question.answer(choice);
    }

    ordinal_suffix_of(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }

    returnClient() {
        return client;
    }

    updateName(newName) {
        this.playerName = newName;
    }

    on(event, callback) {
        client.on(event, callback);
    }
}

let clientC = new ClientClass()

client.on("Joined", () => {
    console.log(`I joined the Game!\n`);
    clientC.score = 0;
});

module.exports = clientC;