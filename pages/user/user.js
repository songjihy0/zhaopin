var app = getApp();
let event = require('../../utils/event.js');
let {
    ripple
} = require('../../utils/ripple.js');
let $ = require('../../utils/util.js')
let {
    server
} = require('../../configs/serverConfig.js');
Page({
    data: {
        userInfoFromWX: {},
        userInfo: null,
        ripple: {
            s1: '',
            s2: '',
            s3: '',
            s4: ''
        }
    },
    onLoad: function() {
        app.getUserInfoFromWX((data) => {
            this.setData({
                userInfoFromWX: data
            })
        })
        $.ajax({
            url: `${server}/seeker/getUserInfo`,
            data: {
                openid: app.globalData.session.openid
            }
        }).then((res) => {
            if (res.statusCode == 200) {
                console.log('getinfo')
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
        event.on('userInfoChanged', this, function(data) {
            this.setData({
                userInfo: data.userInfo
            })
            $.toast('个人信息修改成功', this, true, 1800, false)
        }.bind(this))
    },
    onUnolad: function() {
        event.remove('userInfoChanged', this)
    },
    navigateTo(e) {
        ripple.call(this, e);
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        })
    }
})