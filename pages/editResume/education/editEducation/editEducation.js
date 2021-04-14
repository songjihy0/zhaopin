let event = require('../../../../utils/event.js');
const years = require('../../../../configs/data_configs.js').years;
const degrees = require('../../../../configs/data_configs.js').degrees;
const schools = require('../../../../configs/schools_config.js');
const majors = require('../../../../configs/majors_config.js');
let loop = require('../../../../utils/event-loop.js');
let $ = require('../../../../utils/util.js');
let app = getApp();
Page({
    data: {
        education: {},
        check: {
            degree: true,
            school: true,
            major: true,
            graduation_year: true
        },
        focus: {
            school: false,
            major: false
        },
        hint: {
            school: [],
            major: []
        }
    },
    onLoad: function(options) {
        this.setData({
            education: options
        });
        let _this = this;
        if (options.flag === 'false') {
            _this.setData({
                years: years,
                yearIndex: 17,
                degrees: degrees,
                degreeIndex: 1,
                flag: false //表示新建
            })
        } else {
            years.forEach((val, index) => {
                if (val == _this.data.education.graduation_year) {
                    _this.setData({
                        years: years,
                        yearIndex: index,
                        flag: true
                    })
                }
            })
            degrees.forEach((val, index) => {
                if (val == (_this.data.education.degree)) {
                    _this.setData({
                        degrees: degrees,
                        degreeIndex: index
                    })
                }
            })
        }
    },
    bindYearPickerChange: function(e) {
        this.setData({
            'education.graduation_year': this.data.years[e.detail.value],
            'check.graduation_year': true
        })
    },
    bindDegreePickerChange: function(e) {
        this.setData({
            'education.degree': this.data.degrees[e.detail.value],
            'check.degree': true
        })
    },
    input(e) {
        let {
            key
        } = e.currentTarget.dataset;
        let {
            education,
            check
        } = this.data;
        education[key] = e.detail.value;
        check[key] = true;
        this.setData({
            education: education,
            check: check
        })
        let s_key = $.onlyChinese(e.detail.value);
        if (key == 'school') {
            loop.push('school-input', this, s_key, (key) => {
                if (!key) {
                    this.setData({
                        'hint.school': []
                    })
                    return;
                }
                console.log(2);
                let school = schools.filter((val, index) => {
                    return val.match(key);
                })
                this.setData({
                    'hint.school': school
                })
            }, 300)
        } else if (key == 'major') {
            loop.push('major-input', this, s_key, (key) => {
                if (!key) {
                    this.setData({
                        'hint.major': []
                    })
                    return;
                }
                let major = majors.filter((val, index) => {
                    return val.match(key);
                })
                this.setData({
                    'hint.major': major
                })
            }, 300)
        }
    },
    setInput(e) {
        let { key, index } = e.currentTarget.dataset;
        let {
            education,
            check,
            hint
        } = this.data;
        education[key] = hint[key][index];
        console.log(hint[key][index]);
        check[key] = true;
        this.setData({
            education: education,
            check: check
        })
    },
    focus(e) {
        let key = e.currentTarget.dataset.key;
        let focus = this.data.focus;
        focus[key] = true;
        this.setData({
            focus: focus
        })
    },
    blur(e) {
        let key = e.currentTarget.dataset.key;
        let focus = this.data.focus;
        focus[key] = false;
        this.setData({
            focus: focus
        })
    },
    save: function() {
        this.check('degree');
        this.check('school');
        this.check('major');
        this.check('graduation_year');
        let check = this.data.check;
        let flag = check.degree && check.school && check.major && check.graduation_year;
        if (!flag) {
            return;
        }
        //wx.request
        if (this.data.flag) {
            app.resume('resume/updateEducation', 'POST', {
                education: JSON.stringify(this.data.education)
            }).then((res) => {
                if (res.data) {
                    event.emit('resumeChanged', {
                        key: 'educations',
                        value: this.data.education,
                        event_type: 'change'
                    })
                    wx.navigateBack({})
                }
            })
        } else {
            app.resume('resume/addEducation', 'POST', {
                education: JSON.stringify(this.data.education)
            }).then((res) => {
                if (res.data) {
                    event.emit('resumeChanged', {
                        key: 'educations',
                        value: this.data.education,
                        event_type: 'add'
                    })
                    wx.navigateBack({})
                }
            })
        }
    },
    delete: function() {
        //wx.request
        let _this = this;
        app.resume('resume/deleteEducation', 'POST', {
            id: this.data.education.id
        }).then((res) => {
            if (res.data) {
                event.emit('resumeChanged', {
                    key: 'educations',
                    value: {
                        id: this.data.education.id
                    },
                    event_type: 'delete'
                })
                wx.navigateBack({})
            }
        })
    },
    check(key) {
        let check = this.data.check;
        if (!this.data.education[key] || this.data.education[key] == 'null' || this.data.education[key] == 'undefined') {
            check[key] = false
            this.setData({
                check: check
            })
        } else {
            check[key] = true
            this.setData({
                check: check
            })
        }
    }
})
