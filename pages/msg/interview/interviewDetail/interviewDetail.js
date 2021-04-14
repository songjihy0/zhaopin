const app = getApp();
let {
    server
} = require('../../../../configs/serverConfig');
let $ = require('../../../../utils/util.js');
let event = require('../../../../utils/event.js');
let loop = require('../../../../utils/event-loop.js');
let { ripple } = require('../../../../utils/ripple.js');

Page({
    data: {
        loading: true,
        hiddenLoad: false,
        ripple: {
            s0: ''
        }
    },
    onLoad(options) {
        let id = options.id;
        if (!id) {
            return;
        }
        this.getInterviewById(id)
        event.on('comment', this, () => {
            this.setData({
                'interviewDetail.had_commented': true
            })
        })
    },
    onUnload() {
        event.remove('comment', this);
    },
    getInterviewById(id, cb) {
        $.ajax({
            url: `${server}/interview/getInterviewById`,
            data: {
                id: parseInt(id)
            },
            method: 'GET'
        }).then((res) => {
            if (res.statusCode == 200) {
                let obj = res.data;
                Object.keys(obj).forEach((val) => {
                    if (val.match(/time/g)) {
                        if (obj[val]) {
                            obj[val + '_filter'] = obj[val].substring(0, 16);
                        }
                    }
                })
                this.setData({
                    interviewDetail: obj
                })
                if (!obj.seeker_read) {
                    this.setRead(id);
                }
            }
            app.hiddenLoader(this);
        }).catch(error => app.hiddenLoader(this))
    },
    setRead(id) {
        $.ajax({
            url: `${server}/interview/setRead`,
            data: {
                id: id
            },
            method: 'POST'
        }).then((res) => {
            if (res.statusCode == 200 && res.data) {
                event.emit('interviewRead', {
                    id: id
                })
                event.emit('length--', {
                    key: 'interviewLength',
                    id: id
                })
            }
        })
    },
    navigateTo(e) {
        ripple.call(this, e);
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        })
    }
})
