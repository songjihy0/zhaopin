let app = getApp();

let $ = require('../../utils/util.js');
let event = require('../../utils/event.js');
let loop = require('../../utils/event-loop.js');
let {
    server
} = require('../../configs/serverConfig.js');
let items = require('../../configs/data_configs.js').items
Page({
    data: {
        animationData: {},
        searched: false,
        handleHeight: '',
        active: ['#353535', '#353535', '#353535'],
        hidden: [false, false, false],
        searchMsg: '',
        pickerViewValue: 0,
        salary: {
            lower: 1,
            upper: 50
        },
        jobList: [],
        dataLimit: false,
        searchSuggestions: [],
        showSuggestions: true,
        items: items,
        checkedValues: {
            educations: [],
            types: [],
            industry: [],
            financle: []
        },
        limitCount: 10,
        loading: false,
        searchConfig: {
            checkedValues: {
                educations: [],
                types: [],
                industry: [],
                financle: []
            },
            workplace: {},
            salary: {
                lower: 1,
                upper: 50
            }
        }
    },
    onLoad: function() {
        this.setData({
            searchHistory: wx.getStorageSync('searchHistory') || []
        })
        app.getUserInfo((data) => {
            this.setData({
                userInfoFromWX: data
            })
        })
        let searchConfig = wx.getStorageSync('searchConfig');
        if (searchConfig) {
            this.setData({
                searchConfig: searchConfig,
                salary: searchConfig.salary,
                checkedValues: searchConfig.checkedValues,
                workplace: searchConfig.workplace
            })
            let {
                items
            } = this.data;
            Object.keys(searchConfig.checkedValues).forEach(key => {
                for (let i = 0; i < searchConfig.checkedValues[key].length; i++) {
                    for (let j = 0; j < items[key].length; j++) {
                        if (items[key][j].value == searchConfig.checkedValues[key][i]) {
                            items[key][j].type = 'success_circle'
                        }
                    }
                }
            })
            this.setData({
                items: items
            })
            $.getDistrictByCityName(searchConfig.workplace.city, app.globalData.cityList, this);
        } else {
            app.getWorkplace((data) => {
                this.setData({
                    workplace: data
                })
                $.getDistrictByCityName(data.city, app.globalData.cityList, this);
            })
        }
        event.on('search_city_changed', this, (data) => {
            let workplace = {
                city: data.city,
                district: data.city
            }
            app.globalData.workplace = workplace
            this.setData({
                workplace: workplace
            })
            wx.setStorageSync('workplace', workplace);
            //获取城市区县
            $.getDistrictByCityName(data.city, app.globalData.cityList, this);
        })
    },
    onShow: function() { //这里用es6的箭头函数 this是window
        var res = wx.getSystemInfoSync();
        this.setData({
            handleHeight: res.windowHeight - 48 - 38,
            areaHeight: (res.windowHeight - 48) / 3 * 2 - 38,
            windowHeight: res.windowHeight
        })
    },
    changeDistrict: function(e) {
        let index = e.detail.value[0];
        console.log(index)
        let district = index == 0 ? this.data.workplace.city : this.data.citycidx[index - 1].fullname
        this.setData({
            pickerViewValue: e.detail.value[0],
            'workplace.district': district
        })
    },
    handleAnimate: function(e) {
        const index = e.target.dataset.index;
        if (index == 1) {
            if (this.data.workplace.city == '全国') {
                this.toChooseWorkPlace();
                return;
            }
            this.setData({
                hidden: [false, true, true],
                active: ['#888888', '#353535', '#353535'],
            })
        } else if (index == 2) {
            this.setData({
                hidden: [true, false, true],
                active: ['#353535', '#888888', '#353535']
            })
        } else {
            this.setData({
                hidden: [true, true, false],
                active: ['#353535', '#353535', '#888888']
            })
        }
        this.animate1(0);
    },
    animate1: function(top) {
        //create animation
        var animation = wx.createAnimation({
            duration: 400
        })

        animation.top(top).step();
        // if (this.data.hidden[0] || this.data.hidden[1] || this.data.hidden[2]) {
        // 	animation.top(0).step();
        // } else {
        // 	animation.top(-300).step();
        // }
        this.setData({
            animationData: animation.export()
        })
    },
    hideHandle: function() {
        setTimeout(function() {
            this.setData({
                hidden: [false, false, false],
                active: ['#353535', '#353535', '#353535']
            })
        }.bind(this), 400)
        this.animate1(-400);

        this.checkUpdateSearchConfig();
    },
    cancle() {
        if (!this.data.jobList || this.data.jobList.length == 0) {
            wx.navigateBack({
                delta: 1
            })
        } else {
            this.setData({
                showSuggestions: false,
            })
        }
    },
    clickBtnSearch(e) {
        const val = e.target.dataset.value;
        this.setData({
            searchMsg: val
        })

        this.searchJob();
    },
    checkUpdateSearchConfig() {
        //判断是否设置有变化 没有不刷新
        let {
            searchConfig,
            checkedValues,
            workplace,
            salary
        } = this.data;
        if (checkedValues.educations.sort().toString() != searchConfig.checkedValues.educations.sort().toString() || checkedValues.industry.sort().toString() != searchConfig.checkedValues.industry.sort().toString() || checkedValues.financle.sort().toString() != searchConfig.checkedValues.financle.sort().toString() || checkedValues.types.sort().toString() != searchConfig.checkedValues.types.sort().toString()) {
            console.log('checkedValues不同');
            this.searchJob();
            return;
        } else if (workplace.city !== searchConfig.workplace.city || workplace.district !== searchConfig.workplace.district) {
            console.log('城市不同');
            this.searchJob();
            return;
        } else if (salary.upper !== searchConfig.salary.upper || salary.lower !== searchConfig.salary.lower) {
            console.log('薪水不同');
            this.searchJob();
            return;
        }
        console.log('全部相同');
    },
    searchJob(flag, cb) { //flag为true时表示结果要concat
        this.setData({
            dataLimit: false
        })
        let keys = $.regStrToArr(this.data.searchMsg);
        if (keys.length == 0) return;
        this.setData({
            loading: true,
            hiddenLoader: false
        })
        let {
            searchConfig,
            checkedValues,
            workplace,
            salary
        } = this.data;
        searchConfig = {
            checkedValues,
            workplace,
            salary
        }
        $.ajax({
            url: `${server}/job/searchJob`,
            method: 'POST',
            data: {
                searchConfig: JSON.stringify({
                    keys: keys,
                    workplaces: [workplace.city, workplace.district],
                    educations: checkedValues.educations,
                    types: checkedValues.types,
                    industry: checkedValues.industry,
                    financle: checkedValues.financle,
                    salary: [salary.lower, salary.upper]
                }),
                startIndex: flag ? (this.data.jobList || []).length : 0,
                limitCount: parseInt(this.data.limitCount)
            }
        }).then((res) => {
            if (res.statusCode == 200) {
                let list = res.data;
                list.forEach(val => {
                    val.company.logo = $.setLogo(val.company.logo)
                })
                if (flag) {
                    let {
                        jobList
                    } = this.data;
                    this.setData({
                        jobList: jobList.concat(list)
                    })
                } else {
                    this.setData({
                        jobList: list
                    })
                }
                let arr = wx.getStorageSync('searchHistory') || [];
                let val = this.data.searchMsg;
                if ($.inArray(val, arr) == -1) {
                    arr.unshift(this.data.searchMsg);
                    wx.setStorageSync('searchHistory', arr);
                }
                this.setData({
                    showSuggestions: false,
                    searchHistory: arr,
                    searched: true,
                    searchConfig: searchConfig
                })
                wx.setStorageSync('searchConfig', searchConfig);
                typeof cb == 'function' && cb();
                if (res.data.length < this.data.limitCount) {
                    this.setData({
                        dataLimit: true
                    })
                }
            } else {
                $.toast('搜索职位失败', this, false)
            }
            app.hiddenLoader(this);
        }).catch((error) => {
            $.toast('搜索职位失败', this, false)
            app.hiddenLoader(this);
            console.log(`${'searchJob-fail:'}error`);
        })
    },
    onPullDownRefresh: function() {
        if (!this.data.searched || this.data.searchMsg == '') {
            wx.stopPullDownRefresh();
            return;
        } else {
            this.searchJob(false, () => {
                wx.stopPullDownRefresh();
            });
        }
    },
    loadMore() {
        if (this.data.dataLimit || !this.data.searched || this.data.searchMsg == '') {
            return;
        }
        this.searchJob(true);
    },
    complementSearch: function(e) {
        this.setData({
            searchMsg: e.target.dataset.complement
        })

        // ajax 更新list
        this.searchJob();
    },
    keyInput: function(e) {
        let value = e.detail.value;
        this.setData({
            searchMsg: value
        })

        //通过loop 默认延迟0.5s后执行最后的函数
        loop.push('getSearchRecommand', this, value, (value) => {
            let keys = $.regStrToArr(value);
            if (value == '' || keys.length == 0) {
                this.setData({
                    searchSuggestions: []
                })
                return;
            }
            let {
                city,
                district
            } = this.data.workplace;
            //ajax get searchSuggestions
            $.ajax({
                url: `${server}/job/getSearchRecommand`,
                method: 'POST', //get请求乱码
                data: {
                    job: JSON.stringify({
                        keys: keys,
                        workplaces: [city, district]
                    })
                }
            }).then((res) => {
                if (res.statusCode == 200) {
                    this.setData({
                        searchSuggestions: res.data
                    })
                }
            }).catch((error) => {
                console.log(error);
            })
        })
    },
    showSuggestions: function() {
        this.setData({
            showSuggestions: true
        })
    },
    changeLower: function(e) {
        this.setData({
            'salary.lower': e.detail.value
        })
    },
    changeUpper: function(e) {
        this.setData({
            'salary.upper': e.detail.value
        })
    },
    bindCheckbox: function(e) {
        /*绑定点击事件，将checkbox样式改变为选中与非选中*/

        //拿到下标值，以在items作遍历指示用
        var index = parseInt(e.currentTarget.dataset.index);
        var value = e.currentTarget.dataset.value;
        var items = this.data.items[value];
        //原始的icon状态
        var type = items[index].type;
        if (type == 'circle') {
            //未选中时
            items[index].type = 'success_circle';
        } else {
            items[index].type = 'circle';
        }

        var allItems = this.data.items;
        allItems[value] = items;
        // 写回经点击修改后的数组
        this.setData({
            items: allItems
        });
        // 遍历拿到已经勾选的值
        var checkedValues = this.data.checkedValues;
        checkedValues[value] = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].type == 'success_circle') {
                checkedValues[value].push(items[i].value);
            }
        }
        // 写回data，供提交到网络
        this.setData({
            checkedValues: checkedValues
        });
    },
    navigateTo(e) {
        let {
            url,
            id
        } = e.currentTarget.dataset;
        if (id) {
            wx.navigateTo({
                url: `${url}?id=${id}`
            })
        } else {
            wx.navigateTo({
                url: `${url}?flag=${'search_city'}&city=${this.data.workplace.city}`
            })
        }
    },
    clearHis() {
        wx.removeStorageSync('searchHistory');
        this.setData({
            searchHistory: []
        })
    }
})