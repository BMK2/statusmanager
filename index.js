const EventEmitter = require('events');

class StatusManager extends EventEmitter {
    constructor(_client) {
        super();
        this.client = _client;
        this.statusList = [];
        this.gameIndex = 0;
        this.scheduler = require('node-schedule');
        this.client.on('ready', () => {
            this.loadingStatus();
            this.downloadStatusFromDB();
        });
        this.on('databaseLoaded', () => {
            this.startSchedule();
        });
        this.on('nextStatus', () => {
            this.nextStatus();
        });
    }

    downloadStatusFromDB() {
        this.statusList = [];
        this.client.db.model.findById(process.env.DATABASE_ID, 'botStatus', function(statusManager, err, botDocument) {
            for (const status of botDocument.botStatus) {
                let game = {type: status.statusType, name: status.name};
                statusManager.statusList.push(game);
            }
            statusManager.emit('databaseLoaded');
        }.bind(null, this));
    }

    startSchedule() {
        this.nextStatus();
        const rule = new this.scheduler.RecurrenceRule();
        rule.minute = [0, new this.scheduler.Range(0, 59, 5)];
        this.scheduler.scheduleJob(rule, function(statusManager, fireDate) {
            console.log(fireDate.toLocaleString());
            statusManager.nextStatus();
        }.bind(null, this));
    }

    nextStatus() {
        this.setStatus({game: this.statusList[this.gameIndex]});
        this.gameIndex++;
        if(this.gameIndex == this.statusList.length) this.gameIndex = 0;
    }

    loadingStatus() {
        this.setStatus({game: {name: 'my data load', type: 'WATCHING'}});
    }

    setStatus(presenceData) {
        this.client.user.setPresence(presenceData).then(console.log(`Status updated to ${presenceData.game.type} ${presenceData.game.name}`)).catch((error)=>console.error(error));
    }
};

module.exports = StatusManager;
