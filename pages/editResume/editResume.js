const event = require('../../utils/event.js');
const $ = require('../../utils/util.js');
const {
    server
} = require('../../configs/serverConfig.js');
let app = getApp();
let {
    ripple
} = require('../../utils/ripple.js');
Page({
    data: {
        actionType: '', //0表示新建简历   1表示修改简历
        loading: true,
        ripple: {
            s0: '',
            s1: '',
            s2: '',
            s3: '',
            s4: '',
            s5: '',
            s6: '',
            s7: '',
            s8: '',
            s9: '',
            s10: '',
            s11: '',
            s12: ''
        }
    },
    onLoad: function(options) {
        if (options.flag == 'true') {
            this.setData({
                actionType: 1,
            })

            // 通过options.id  获取简历信息
            this.getResume(options.id);
        } else {
            //新建简历
            this.setData({
                actionType: 0
            })
            wx.setNavigationBarTitle({
                title: '新建简历'
            })
        }
        // app.getUserInfo((data) => {
        //     this.setData({
        //         userInfo: data
        //     })
        // })
        $.ajax({
            url: `${server}/seeker/getUserInfo`,
            data: {
                openid: app.globalData.session.openid
            }
        }).then((res) => {
            if (res.statusCode == 200) {
                app.globalData.userInfo = res.data;
                wx.setStorageSync('userInfo', res.data);
                this.setData({
                    userInfo: res.data
                })
            } else {
                app.getUserInfo((data) => {
                    this.setData({
                        userInfo: data
                    })
                })
            }
        }).catch((res) => {
            app.getUserInfo((data) => {
                this.setData({
                    userInfo: data
                })
            })
        })
        app.getUserInfoFromWX((data) => {
            this.setData({
                userInfoFromWX: data
            })
        })

        //添加event 进行跨page通讯
        event.on('resumeChanged', this, event.cb.bind(this));
    },
    onShow: function() {

    },
    onUnload: function() {
        event.remove('resumeChanged', this);
    },
    getResume(id) {
        $.ajax({
            url: `${server}/resume/getResume`,
            data: {
                id: id
            }
        }).then((res) => {
            if (res.data) {
                this.setData({
                    resume: res.data
                })
                app.hiddenLoader(this);
            }
        })
    },
    navigateTo(e) {
        ripple.call(this, e);
        let {
            url
        } = e.currentTarget.dataset;
        wx.navigateTo({
            url: url
        })
    },
    gotoPage(e) {
        ripple.call(this, e);
        let {
            flag,
            url,
        } = e.currentTarget.dataset;
        let resume_id = this.data.resume.id;
        if (flag == 'true') {
            wx.navigateTo({
                url: `${url}?resume_id=${resume_id}`
            })
        } else {
            wx.navigateTo({
                url: `${url}?resume_id=${resume_id}&flag=false`
            })
        }
    },
    toSelfAssessment: function(e) {
        ripple.call(this, e);
        wx.navigateTo({
            url: `selfAssessment/selfAssessment?msg=${e.currentTarget.dataset.msg}&resume_id=${this.data.resume.id}`
        })
    },
    toHope: function(e) {
        ripple.call(this, e);
        let {
            hope
        } = this.data.resume;
        if (hope == null) {
            wx.navigateTo({
                url: `hope/hope?resume_id=${this.data.resume.id}`
            })
            return;
        }
        console.log(2);
        wx.navigateTo({
            url: `hope/hope?id=${hope.id}&job=${hope.job}&type=${hope.type}&city=${hope.city}&salary=${hope.salary}&otherDescription=${hope.otherDescription}&resume_id=${this.data.resume.id}`
        })
    }
})