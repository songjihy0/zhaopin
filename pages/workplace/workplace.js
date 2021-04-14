const app = getApp();
let event = require('../../utils/event.js');
const citys = require('../../configs/citys_config.js');
let $ = require('../../utils/util.js')
Page({
    data: {
        pickerValue: [0, 0]
    },
    onLoad: function(options) {
        try {
            let windowHeight = wx.getSystemInfoSync().windowHeight;
            this.setData({
                windowHeight: windowHeight,
                city_data: citys
            })
            console.log(1);
        } catch (err) {}

        let {
            flag,
            city
        } = options;
        this.setData({
            flag: flag,
            old_city: city
        })
        setTimeout(function(city) {
            return function() {
                console.log(city)
                if (city == 'undefined' || city == 'null' || !city) {
                    this.setData({
                        workplaceCity: ''
                    })
                } else {
                    this.setData({
                        workplaceCity: city
                    })
                }
            }.bind(this)
        }.call(this, city), 1000)
    },
    goBack: () => {
        wx.navigateBack({})
    },
    onUnload() {
        let {
            flag,
            workplaceCity,
            old_city
        } = this.data;
        if (workplaceCity == old_city) {
            return;
        }
        if (flag == 'hope_city') {
            event.emit('hope_city_changed', {
                city: workplaceCity
            })
        } else if (flag == 'userInfo_city') {
            event.emit('cityChanged', {
                city: workplaceCity
            })
        } else if (flag == 'search_city') {
            if (app.globalData.workplaceCity != this.data.workplaceCity) {
                event.emit('search_city_changed', {
                    city: workplaceCity
                })
            }
        }
    },
    pickerChange(e) {
        const val = e.detail.value;
        console.log(val);
        this.setData({
            workplaceCity: citys[val[0]].citys[val[1]],
            pickerValue: val
        })
    },
    selectPlace: function(e) {
        this.setData({
            workplaceCity: e.target.dataset.place
        })
        $.toast('城市切换成功', this)
    }
})