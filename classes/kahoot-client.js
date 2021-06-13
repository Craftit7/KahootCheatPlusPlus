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
        this.Qid = "";
        this.Qname = "";
        this.PIN = "";
        this.joinedBeforeQuizStarts = false;
        this.totalScore = 0;
        this.playerName = null;
    }

    returnName() {
        return this.playerName;
    }

    getThis() {
        return this;
    }

    async getQidFromQname(qname) {
        let uri = `https://create.kahoot.it/rest/kahoots/?query=${qname}&limit=20&cursor=1&searchCluster=20`;
        await fetch(uri).then(async res => await res.json()).then(json => {
            //fetch
            if (json.totalHits < 1) {
                this.QNF = true
                return false; //Quiz not found.
            } else {
                this.Qid = json.entities[0].card.uuid;
                this.Qname = qname;
                return this.Qid;
            }
        });
    }

    async validateQid(Qid) {
        let regEx = /(?:[[:alnum:]]{8})-(?:[[:alnum:]]{4})-(?:[[:alnum:]]{4})-(?:[[:alnum:]]{4})-(?:[[:alnum:]]{12})/gm
        if (!regEx.test(Qid)) return false;
        let uri = "https://create.kahoot.it/rest/kahoots/" + Qid + "/card/?includeKahoot=true";
        await fetch(uri).then(async res => await res.json()).then(json => {
            if (!json.error) return true;
            if (json.error == "NOT_FOUND") return "NOT_FOUND";
            if (json.error == "FORBIDDEN") return "FORBIDDEN";
            return true;
        });
    }

    updateQid(qid) {
        this.Qid = qid;
        this.Qname = "Id is entered.";
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
});

module.exports = clientC;