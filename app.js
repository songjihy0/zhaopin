const $ = require('utils/util.js');
const {
    server
} = require('configs/serverConfig.js');
let event = require('utils/event.js');
import Websocket from './utils/websocket';
let ws = new Websocket();
App({
    onLaunch: function() {
        //     wx.clearStorage()
        let location = wx.getStorageSync('location');
        if (!location) {
            $.getLocation(this);
        } else {
            this.globalData.location = location;
        }
        //获取本地存储的cityList
        let cityList = wx.getStorageSync('cityList');
        if (!cityList) {
            $.getCityList(this); //调用腾讯地图开放平台获取城市列表 保存在本地存储
        } else {
            this.globalData.cityList = cityList;
        }

        //如果本地不存在session 调用登录
        let session = wx.getStorageSync('session');
        if (!session) {
            this.login(() => {
                this.connectSocket();
            });
        } else {
            this.globalData.session = session;
            this.connectSocket();
        }

        event.on('userInfoChanged', this, function(data) {
            this.globalData.userInfo = data.userInfo
        }.bind(this))

        let config = wx.getStorageSync('config');
        if (config) {
            this.globalData.config = config;
        } else {
            this.getConfig();
        }

    },
    onShow: function() {
        //checkSession
        this.checkSession();
    },
    login(cb) {
        console.log('登录');
        let that = this;
        $.ajaxLogin().then((res) => {
            if (res) {
                //登录成功 得到code 发送到服务器换取session
                return $.ajax({
                    url: server + '/common/onLogin',
                    data: {
                        code: res.code,
                        identity: that.globalData.identity
                    }
                })
            }
        }).catch((error) => {
            console.log('登录失败!');
            console.log(error);
        }).then((res) => {
            if (res.statusCode == 200) {
                //获取session成功 保存到globalData中并存储到本地
                console.log('登录成功:' + res.data);
                that.globalData.session = res.data;
                wx.setStorageSync('session', res.data);
            }
            typeof cb == 'function' && cb();
        })
    },
    checkSession() {
        let that = this;
        wx.checkSession({
            fail: () => {
                that.login();
            }
        })
    },
    getUserInfoFromWX(cb) {
        let _this = this;
        if (this.globalData.userInfoFromWX) {
            typeof cb == "function" && cb(this.globalData.userInfoFromWX)
        } else {
            let userInfoFromWX = wx.getStorageSync('userInfoFromWX');
            if (!userInfoFromWX) {
                wx.login({
                    success: function() {
                        wx.getUserInfo({
                            success: function(res) {
                                _this.globalData.userInfoFromWX = res.userInfo;
                                wx.setStorageSync('userInfoFromWX', res.userInfo);
                                typeof cb == "function" && cb(_this.globalData.userInfoFromWX)
                            },
                            fail: function() {
                                console.log('用户拒绝授权');
                                _this.globalData.userInfoFromWX = {};
                                typeof cb == "function" && cb(_this.globalData.userInfoFromWX)
                            }
                        })
                    }
                })
            } else {
                _this.globalData.userInfoFromWX = userInfoFromWX;
                typeof cb == "function" && cb(_this.globalData.userInfoFromWX)
            }
        }
    },
    getUserInfo(cb) {
        let _this = this;
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //    let userInfo = wx.getStorageSync('userInfo');
            let userInfo = null;
            if (!userInfo) {
                let timer = setInterval(function() {
                    let {
                        openid
                    } = _this.globalData.session;
                    if (!openid) {
                        console.log(4)
                        return;
                    }
                    console.log(5);
                    $.ajax({
                        url: `${server}/seeker/getUserInfo`,
                        data: {
                            openid: openid
                        }
                    }).then((res) => {
                        if (res.statusCode == 200) {
                            clearInterval(timer);
                            _this.globalData.userInfo = res.data;
                            wx.setStorageSync('userInfo', res.data);
                            typeof cb == "function" && cb(_this.globalData.userInfo)
                        } else {
                            _this.globalData.userInfo = wx.getStorageSync('userInfo');;
                            typeof cb == "function" && cb(_this.globalData.userInfo)
                            clearInterval(timer);
                        }
                    }).catch((res) => {
                        _this.globalData.userInfo = wx.getStorageSync('userInfo');;
                        typeof cb == "function" && cb(_this.globalData.userInfo)
                        clearInterval(timer);
                    })
                }.bind(this), 2000)
            } else {
                _this.globalData.userInfo = userInfo;
                typeof cb == "function" && cb(_this.globalData.userInfo)
            }
        }
    },
    getWorkplace(cb) {
        let workplace = this.globalData.workplace || wx.getStorageSync('workplace');
        let _this = this;
        if (workplace) {
            typeof cb == 'function' && cb(workplace)
        } else {
            $.getWorkplace(this, function() {
                typeof cb == "function" && cb(_this.globalData.workplace);
            });
        }
    },
    resume(url, method, data) {
        return $.ajax({
            url: `${server}/${url}`,
            method: method,
            data: data
        })
    },
    getLocation(cb) {
        let _this = this;
        if (this.globalData.location) {
            typeof cb == 'function' && cb(this.globalData.location);
        } else {
            $.getLocation(this, function() {
                typeof cb == "function" && cb(_this.globalData.location);
            })
        }
    },
    getCollectionLength(cb) {
        this.globalData.collectionLength = wx.getStorageSync('collectionLength');
        let collectionLength = this.globalData.collectionLength;
        if (collectionLength) {
            typeof cb == 'function' && cb(collectionLength)
        } else {
            let timer = setInterval(function() {
                let {
                    openid
                } = this.globalData.session;
                if (!openid) {
                    return;
                }
                $.ajax({
                    url: `${server}/collection/getCollectionLength`,
                    data: {
                        openid: openid
                    }
                }).then((res) => {
                    if (res.statusCode == 200) {
                        this.globalData.collectionLength = res.data;
                        wx.setStorageSync('collectionLength', res.data);
                        cb(res.data);
                        clearInterval(timer);
                    } else {
                        clearInterval(timer);
                    }
                }).catch((error) => {
                    clearInterval(timer);
                })
            }.bind(this), 2000)
        }
    },
    getConfig(cb) {
        let {
            config
        } = this.globalData;
        if (config) {
            typeof cb == 'function' && cb(config)
        } else {
            let timer = setInterval(function() {
                let {
                    openid
                } = this.globalData.session;
                if (!openid)
                    return;
                $.ajax({
                    url: `${server}/config/getConfig`,
                    data: {
                        openid: openid
                    }
                }).then((res) => {
                    if (res.statusCode == 200) {
                        this.globalData.config = res.data;
                        wx.setStorageSync('config', res.data);
                        typeof cb == 'function' && cb(res.data)
                        clearInterval(timer);
                    }
                }).catch((error) => {
                    clearInterval(timer);
                })
            }.bind(this), 2000)
        }
    },
    hiddenLoader(self) {
        self.setData({
            loading: false
        })
        setTimeout(function() {
            self.setData({
                hiddenLoader: true
            })
        }, 600)
    },
    connectSocket() {
        ws.open({
            openid: this.globalData.session.openid
        });
        ws.on((res) => {
            console.log(res);
            this.wsHandler(JSON.parse(res.data));
        });
    },
    wsHandler(obj) {
        let {
            action
        } = obj;
        //action是int型参数 0代表有简历状态信息 1代表有职位邀请信息 2代表有面试邀请信息
        console.log(obj);
        event.emit('ws_msg');
        if (action == 0) {
            console.log("event.emit('ws_resume_status_update')")
            event.emit('ws_resume_status_update');
        } else if (action == 1) {
            console.log(" event.emit('ws_job_invication_update');")
            event.emit('ws_job_invication_update');
        } else if (action == 2) {
            console.log("event.emit('ws_interview_update')")
            event.emit('ws_interview_update');
        }
    },
    globalData: {
        userInfoFromWX: null,
        location: null,
        workplace: null,
        cityList: [],
        identity: 0, //0代表seeker  1代表hr
        session: {},
        userInfo: null,
        collectionLength: null,
        config: null
    }
})