const app = getApp();
let $ = require('../../../../utils/util.js');
let {
    server
} = require('../../../../configs/serverConfig.js');
let event = require('../../../../utils/event.js');
Page({
    data: {

    },
    onLoad(options) {
        let id = options.id;
        if (id) {
            this.getDeliverRecode(id)
        }
    },
    getDeliverRecode(id) {
        this.setData({
            loading: true,
            hiddenLoader: false
        })
        $.ajax({
            url: `${server}/resumeStatus/getDeliverRecodeById`,
            method: 'GET',
            data: {
                id: id
            }
        }).then((res) => {
            if (res.statusCode === 200) {
                let obj = res.data;
                obj.job.company.logo = $.setLogo(obj.job.company.logo)
                Object.keys(obj).forEach((val) => {
                    if (val.match(/time/g)) {
                        if (obj[val]) {
                            obj[val + '_filter'] = obj[val].dateFilter();
                        }
                    }
                })
                this.setData({
                    detail: obj
                })
                if (!obj.seeker_read) {
                    this.setRead(id);
                }
            }
            app.hiddenLoader(this);
        }).catch((error) => app.hiddenLoader(this))
    },
    setRead(id) {
        $.ajax({
            url: `${server}/resumeStatus/setRead`,
            method: 'POST',
            data: {
                id: id
            }
        }).then((res) => {
            console.log(event.events);
            event.emit('resumeStatusRead', {
                id: id
            })
            event.emit('length--', {
                key: 'resumeStatusLength',
                id: id
            })
        })
    }
})