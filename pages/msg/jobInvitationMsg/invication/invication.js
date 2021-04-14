const app = getApp();
let {
    server
} = require('../../../../configs/serverConfig');
let $ = require('../../../../utils/util.js');
let event = require('../../../../utils/event.js');
let loop = require('../../../../utils/event-loop.js');
let {
    ripple
} = require('../../../../utils/ripple.js');
Page({
    data: {
        btnDisable: false,
        hadDelivered: false
    },
    onLoad: function(options) {
        let {
            id,
            job_id
        } = options;
        this.getInvication(id);
        this.getJobDetail(job_id);
        app.getUserInfoFromWX((data) => {
            this.setData({
                userInfoFromWX: data
            })
        })
        app.getUserInfo((data) => {
            this.setData({
                userInfo: data
            })
        })
    },
    setRead(id) {
        $.ajax({
            url: `${server}/jobInvication/setSeekerRead`,
            data: {
                id: id
            },
            method: 'POST'
        }).then((res) => {
            if (res.statusCode == 200 && res.data) {
                event.emit('invicationRead', {
                    id: id
                })
                event.emit('length--', {
                    key: 'jobInvicationLength',
                    id: id
                })
            }
        })
    },
    getInvication(id) {
        $.ajax({
            url: `${server}/jobInvication/getInvication`,
            data: {
                id: parseInt(id)
            },
            method: 'GET'
        }).then((res) => {
            if (res.statusCode == 200) {
                this.setData({
                    invication: res.data
                })
                if (!res.data.seeker_read) {
                    this.setRead(id);
                }
            }
        })
    },
    getJobDetail(id) {
        this.setData({
            loading: true,
            hiddenLoader: false
        })
        $.ajax({
            url: `${server}/job/getJobDetail`,
            data: {
                id: parseInt(id)
            }
        }).then((res) => {
            if (res.statusCode == 200) {
                res.data.company.logo = $.setLogo(res.data.company.logo)
                if (res.data.campustalk.length > 1) {
                    res.data.campustalk.sort((a, b) => {
                        return a.date_time > b.date_time
                    })
                    let now = $.formatTime(new Date()).substring(0, 16);
                    console.log(now);
                    let flag = false;
                    res.data.campustalk.map((val) => {
                        if (val.date_time < now) {
                            val.status = 'out_of_date';
                        } else if (!flag) {
                            flag = true;
                            val.status = 'dead_line'
                        } else {
                            val.status = 'after_the_date'
                        }
                    })
                }
                this.setData({
                    jobDetail: res.data
                })
            }
            app.hiddenLoader(this);
        })
    },
    isStar(id) {
        $.ajax({
            url: `${server}/collection/isStar`,
            data: {
                job_id: parseInt(id),
                openid: app.globalData.session.openid
            },
            method: 'GET'
        }).then((res) => {
            if (res.statusCode && res.statusCode == 200) {
                this.setData({
                    star: res.data,
                    STAR: res.data
                })
            }
        })
    },
    openMap: function() {
        // const latitude = parseFloat(this.data.job.workplace.location.latitude);
        // const longitude = parseFloat(this.data.job.workplace.location.longitude);
        // wx.openLocation({
        // 	latitude: latitude,
        // 	longitude: longitude,
        // 	scale: 16
        // })
    },
    showModal(title, cb) {
        wx.showModal({
            title: title,
            content: '',
            success: function(res) {
                if (res.confirm) {
                    typeof cb == 'function' && cb();
                }
            }
        })
    },
    setResult(result) {
        $.ajax({
            url: `${server}/jobInvication/setResult`,
            data: {
                id: this.data.invication.id,
                result: result,
                set_resule_date_time: $.formatTime(new Date())
            },
            method: 'POST'
        }).then((res) => {
            if (res.statusCode == 200 && res.data) {
                this.setData({ //结果处理成功
                    'invication.result': result,
                    'invication.status': '已处理'
                })
                event.emit('setInvicationResult', {
                    id: id,
                    result: result,
                    status: '已处理'
                })
            }
        }).catch((err) => console.log(err))
    },
    handler(e) {
        let {
            result
        } = e.currentTarget.dataset;
        if (result == 'false') { //拒绝
            this.showModal('你确定要拒绝吗?', function() {
                this.setResult(false);
            }.bind(this))
        } else {
            this.showModal('你确定要接受吗?', function() {
                this.setResult(true);
            }.bind(this))
        }
    }
})