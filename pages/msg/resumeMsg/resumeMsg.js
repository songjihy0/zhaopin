const app = getApp();
let {
    server
} = require('../../../configs/serverConfig.js');
let $ = require('../../../utils/util.js');
let event = require('../../../utils/event.js');
Page({
    data: {
        pages: [{
            key: '全部',
            count: 0,
            loaded: true
        }, {
            key: '未查看',
            count: 0,
            loaded: false
        }, {
            key: '待沟通',
            count: 0,
            loaded: false
        }, {
            key: '面试',
            count: 0,
            loaded: false
        }, {
            key: '不合适',
            count: 0,
            loaded: false
        }],
        current: 0,
        sliderLeft: 0
    },
    onLoad() {
        let {
            windowWidth,
            windowHeight
        } = wx.getSystemInfoSync();
        let {
            pages
        } = this.data;
        this.setData({
            sliderLeft: windowWidth / pages.length,
            windowHeight: windowHeight,
            windowWidth: windowWidth,
            loading: true,
            hiddenLoader: false
        });
        event.on('resumeStatusRead', this, (data) => {
            let resumeStatusList = this.data.resumeStatusList;
            console.log('on');
            resumeStatusList.forEach((val) => {
                if (val.id == data.id) {
                    val.seeker_read = true;
                }
            })
            this.setData({
                resumeStatusList: resumeStatusList
            })
            wx.setStorageSync('resumeStatusList', resumeStatusList)
        })
        event.on('ws_resume_status_update', this, () => {
            this.getResumeStatus();
        })
        this.getResumeStatus();
    },
    onUnload() {
        event.remove('resumeStatusRead', this);
        event.remove('ws_resume_status_update', this);
    },
    getResumeStatus(cb) {
        $.ajax({
            url: `${server}/resumeStatus/getUnRead`,
            data: {
                openid: app.globalData.session.openid
            },
            method: 'POST'
        }).then((res) => {
            if (res.statusCode == 200) {
                let oldResumeStatusList = wx.getStorageSync('resumeStatusList') || [];
                res.data.forEach((val) => {
                    oldResumeStatusList = oldResumeStatusList.filter((value) => {
                        return val.id != value.id
                    })
                    val.job.company.logo = $.setLogo(val.job.company.logo)
                })
                let resumeStatusList = res.data.concat(oldResumeStatusList);
                let pages = this.data.pages;
                resumeStatusList.map((val, index, arr) => {
                    if (val.deliver_date_time) {
                        val.deliver_date_time_filter = val.deliver_date_time.dateFilter();
                    }
                    pages.map((page) => {
                        if (page.key == val.status) {
                            return page.count++;
                        }
                    })
                })
                pages[0].count = resumeStatusList.length;
                this.setData({
                    resumeStatusList: resumeStatusList,
                    pages: pages
                })
                wx.setStorageSync('resumeStatusList', resumeStatusList)
                typeof cb == 'function' && cb();
            } else {
                let oldResumeStatusList = wx.getStorageSync('resumeStatusList') || [];
                this.setData({
                    resumeStatusList: oldResumeStatusList
                })
                $.toast('获取失败', this, false)
            }
            app.hiddenLoader(this)
        }).catch(error => {
            app.hiddenLoader(this);
            let oldResumeStatusList = wx.getStorageSync('resumeStatusList') || [];
            this.setData({
                resumeStatusList: oldResumeStatusList
            })
            $.toast('获取失败', this, false)
        })
    },
    onPullDownRefresh() {
        this.getResumeStatus(() => {
            wx.stopPullDownRefresh();
        })
    },
    changeIndicatorDots: function(e) {
        this.setData({
            indicatorDots: !this.data.indicatorDots
        })
    },
    changeCurrent(e) {
        let {
            current,
            pages
        } = this.data;
        pages[current].loaded = true
        current = parseInt(e.currentTarget.dataset.index);
        this.setData({
            current: current,
            pages: pages
        })
    },
    currentChanged(e) {
        let current = e.detail.current;
        let pages = this.data.pages;
        pages[current].loaded = true
        this.setData({
            current: current,
            pages: pages
        })
    },
    navigateTo(e) {
        wx.navigateTo({
            url: `deliverRecode/deliverRecode?id=${e.currentTarget.dataset.id}`
        })
    }
})