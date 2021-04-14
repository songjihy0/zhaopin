var app = getApp();
let $ = require('../../utils/util.js');
const {
    server
} = require('../../configs/serverConfig.js');
let {
    ripple
} = require('../../utils/ripple.js');
Page({
    data: {
        userInfoFromWX: {},
        index: 0,
        changeResumeName: false,
        loading: true
    },
    onLoad: function() {
        app.getUserInfoFromWX((data) => {
            this.setData({
                userInfoFromWX: data
            })
        })
        let defaultResumeId = wx.getStorageSync('defaultResumeId');
        this.setData({
            defaultResumeId: defaultResumeId
        })
        this.getResumesName();
    },
    getResumeName(resume_id) {
        if (!resume_id) return '';
        let name = '';
        this.data.resumes.forEach((val, index) => {
            if (val.id == resume_id) {
                name = this.data.resumes[index].name;
            }
        })
        return name;
    },
    getResumesName() {
        $.ajax({
            url: `${server}/resume/getResumesName`,
            data: {
                openid: app.globalData.session.openid
            }
        }).then((res) => {
            if (res.statusCode == 200) {
                let ripple = {};
                for (let i = 0; i < res.data.length + 2; i++) {
                    ripple["s" + i] = '';
                }
                this.setData({
                    resumes: res.data,
                    ripple: ripple
                })
                this.setData({
                    defaultResumeName: this.getResumeName(this.data.defaultResumeId)
                })
            } else {
                $.toast('获取简历失败', this, false)
            }
            app.hiddenLoader(this);
        }).catch((err) => {
            app.hiddenLoader(this);
            $.toast('获取简历失败', this, false)
        })
    },
    toEditResume: function(e) {
        ripple.call(this, e);
        let {
            flag,
            id
        } = e.currentTarget.dataset;
        let options = `flag=${flag}&id=${id}`;
        wx.navigateTo({
            url: '../editResume/editResume?' + options
        });
    },
    setDefaultResume: function(e) {
        ripple.call(this, e);
    },
    bindPickerChange: function(e) {
        let index = e.detail.value;
        console.log(index);
        this.setData({
            index: index,
            defaultResumeId: this.data.resumes[index].id,
            defaultResumeName: this.getResumeName(this.data.resumes[index].id)
        })
        wx.setStorageSync('defaultResumeId', this.data.resumes[index].id)
    },
    cancel() {
        this.setData({
            changeResumeName: false
        })
    },
    confirm() {
        if (!this.data.newResumeName) {
            $.toast('名字不能为空', this)
        } else {
            $.ajax({
                url: `${server}/resume/changeResumeName`,
                method: 'POST',
                data: {
                    id: this.data.actionResumeId,
                    name: this.data.newResumeName
                }
            }).then((res) => {
                if (res.data) {
                    let {
                        resumes,
                        actionIndex
                    } = this.data;
                    resumes[actionIndex].name = this.data.newResumeName;
                    this.setData({
                        resumes: resumes,
                        changeResumeName: false,
                        actionIndex: '',
                        actionResumeId: '',
                        newResumeName: '',
                        defaultResumeName: this.getResumeName(this.data.defaultResumeId)
                    })
                    $.toast('修改成功', this)
                } else {
                    $.toast('修改失败', this)
                }
            }).catch(res => $.toast('修改失败', this))
        }
    },
    inputNewResumeName(e) {
        let newResumeName = e.detail.value;
        this.setData({
            newResumeName: newResumeName
        })
    },
    newResume(e) {
        ripple.call(this, e);
        if (this.data.resumes.length >= 5) {
            $.toast('您的简历个数已达上限', this)
            return;
        }
        $.ajax({
            url: `${server}/resume/addResume`,
            method: 'POST',
            data: {
                openid: app.globalData.session.openid,
                name: '简历'
            }
        }).then((res) => {
            if (res.statusCode == 200 && res.data) {
                let {
                    resumes
                } = this.data;
                resumes.push(res.data);
                let ripple = {};
                for (let i = 0; i < resumes.length + 2; i++) {
                    ripple["s" + i] = '';
                }
                this.setData({
                    resumes: resumes,
                    ripple
                })
                let flag = true;
                let options = `flag=${flag}&id=${res.data.id}`;
                wx.navigateTo({
                    url: '../editResume/editResume?' + options
                });
            } else {
                $.toast('新建简历失败', this, false)
            }
        }).catch(res => $.toast('新建简历失败', this, false))
    },
    openActionSheet(e) {
        let _this = this;
        let {
            id,
            index
        } = e.currentTarget.dataset;
        wx.showActionSheet({
            itemList: ['修改简历名称', '删除简历'],
            success: function(res) {
                let {
                    tapIndex
                } = res;
                if (tapIndex == 0) {
                    _this.setData({
                        changeResumeName: true,
                        actionResumeId: id,
                        actionIndex: index,
                        actionResumeName: _this.getResumeName(id)
                    })
                } else if (tapIndex == 1) {
                    $.ajax({
                        url: `${server}/resume/deleteResume`,
                        method: 'POST',
                        data: {
                            id: id
                        }
                    }).then((res) => {
                        if (res.data) {
                            let {
                                resumes
                            } = _this.data;
                            resumes.splice(index, 1);
                            _this.setData({
                                resumes: resumes
                            })
                            $.toast('删除简历成功', _this)
                        } else {
                            $.toast('删除简历失败', _this, false)
                        }
                    }).catch(res => $.toast('删除简历失败', _this, false))
                }
            }
        })
    }
})