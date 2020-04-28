const EventEmitter = require('events');

class StatusManager extends EventEmitter {
    constructor(_client) {
        super();
        this.client = _client;
        this.statusList = [];
        this.gameIndex = 0;
        this.scheduler = require('node-schedule');
        this.loadingStatus();
        this.downloadStatusFromDB();
        this.on('databaseLoaded', () => {
            this.startSchedule();
        });
        this.on('nextStatus', () => {
            this.nextStatus();
        });
    }

    downloadStatusFromDB() {
        console.log('Downloading status list from DB');
        this.statusList = [];
        this.client.db.botModel.findById(process.env.DATABASE_ID, 'botStatusList', function(statusManager, err, botDocument) {
            for (const status of botDocument.botStatusList) {
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
        this.setStatus({activity: this.statusList[this.gameIndex], status: 'online'});
        this.gameIndex++;
        if(this.gameIndex == this.statusList.length) this.gameIndex = 0;
    }

    loadingStatus() {
        this.setStatus({activity: {name: 'my data load', type: 'WATCHING'}});
    }

    setStatus(presenceData) {
        this.client.user.setPresence(presenceData).then((presence) => {
            console.log(`Status updated to ${presence.activities[0].type} ${presence.activities[0].name}`)
        }).catch((error)=>console.error(error));
    }
};

module.exports = StatusManager;
