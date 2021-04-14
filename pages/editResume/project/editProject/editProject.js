let event = require('../../../../utils/event.js');
var $ = require('../../../../utils/util.js');
const years = require('../../../../configs/data_configs.js').years;
const degrees = require('../../../../configs/data_configs.js').degrees;
let app = getApp();
Page({
	data: {
		project: {},
		maxlength: 1000,
		checked: false,
		check: {
			name: true,
			start_date: true,
			duty: true,
			end_date: true
		}
	},
	onLoad: function(options) {
		this.setData({
			project: options,
			now: $.formatDate(new Date())
		});
		if (options.description == 'null') {
			this.setData({
				'project.description': ''
			})
		}
		if (options.end_date == '至今') {
			this.setData({
				checked: true
			})
		}
		if (options.flag === 'false') {
			this.setData({
				flag: false //表示新建
			})
		} else {
			this.setData({
				flag: true
			})
		}
	},
	bindEndPickerChange: function(e) {
		this.setData({
			'project.end_date': e.detail.value,
			checked: false,
			'check.end_date': true
		})
	},
	bindStartPickerChange: function(e) {
		this.setData({
			'project.start_date': e.detail.value,
			'check.start_date': true
		})
	},
	input(e) {
		let {
			key
		} = e.currentTarget.dataset;
		let {
			project,
			check
		} = this.data;
		project[key] = e.detail.value;
		check[key] = true;
		this.setData({
			project: project,
			check: check
		})
	},
	save: function() {
		this.check('name');
		this.check('start_date');
		this.check('end_date');
		this.check('duty');
		let check = this.data.check;
		let flag = check.name && check.duty && check.start_date && check.end_date;
		if (!flag)
			return;
		//wx.request
		if (this.data.flag) {
			app.resume('resume/updateProject', 'POST', {
				project: JSON.stringify(this.data.project)
			}).then((res) => {
				if (res.data) {
					event.emit('resumeChanged', {
						key: 'projects',
						value: this.data.project,
						event_type: 'change'
					})
					wx.navigateBack({})
				}
			})
		} else {
			app.resume('resume/addProject', 'POST', {
				project: JSON.stringify(this.data.project)
			}).then((res) => {
				if (res.data) {
					event.emit('resumeChanged', {
						key: 'projects',
						value: this.data.project,
						event_type: 'add'
					})
					wx.navigateBack({})
				}
			})
		}
	},
	delete: function() {
		//wx.request
		app.resume('resume/deleteProject', 'POST', {
			id: this.data.project.id
		}).then((res) => {
			if (res.data) {
				event.emit('resumeChanged', {
					key: 'projects',
					value: {
						id: this.data.project.id
					},
					event_type: 'delete'
				})
				wx.navigateBack({})
			}
		})
	},
	textareaInput: function(e) {
		this.setData({
			'project.description': e.detail.value
		})
	},
	changeChecked: function() {
		this.setData({
			checked: true,
			'project.end_date': '至今',
			'check.end_date': true
		})
	},
	check(key) {
		let check = this.data.check;
		if (!this.data.project[key] || this.data.project[key] == 'null' || this.data.project[key] == 'undefined') {
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