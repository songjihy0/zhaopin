/**
 * event.js
 * 用于微信小程序跨页面通讯
 * @date 2017-02-24
 * @author linrui
 */

let $ = require('./util.js')
let events = {};

/**
 * [on description] 
 * @param  {[type]}   name     [description]  event name
 * @param  {[type]}   self     [description]  the obj when event execute
 * @param  {Function} callback [description]  callback function
 * @return {[type]}            [description]
 */
function on(name, self, callback) {
    let tuple = {
        'self': self,
        callback: callback
    };
    let tuples = events[name] || [];
    tuples.push(tuple);
    events[name] = tuples;
}

/**
 * [emit description] 
 * @param  {[type]} name [description]  event name
 * @param  {[type]} data [description]  the callback props
 * @return {[type]}      [description]  
 */
function emit(name, data) {
    let tuples = events[name] || [];
    tuples.map((tuple) => {
        let _this = tuple['self'];
        let callback = tuple['callback'];
        callback.call(_this, data);
    })
}

/**
 * [remove description] remove event listener
 * @param  {[type]} name [description]  event name
 * @param  {[type]} self [description]  the obj when event execute
 * @return {[type]}      [description]
 */
function remove(name, self) {
    let tuples = events[name] || [];
    events[name] = tuples.filter((tuple) => {
        return tuple['self'] != self;
    })
}

/**
 * [cb description] resume修改新建等通用callback 一共3种event_type change add delete
 * @param  {[type]}   data [description] 
 * @return {Function}      [description]
 */
function cb(data) {
    if (!inArray(data.key, Object.keys(this.data.resume))) return;
    let _key = data.key;
    let _resume = this.data.resume;
    $.toast('修改成功', this, true, 1800, false)
    if (data.event_type == 'change') {
        if (Array.isArray(_resume[_key])) {
            _resume[_key].forEach((val, index) => {
                if (val.id == data.value.id) {
                    _resume[_key][index] = data.value;
                    this.setData({
                            resume: _resume
                        })
                        //    $.toast('修改成功', this)
                }
            })
        } else {
            if (_key == 'userInfo') {
                this.setData({
                        userInfo: data.value
                    })
                    //   $.toast('修改成功', this)
            } else {
                _resume[_key] = data.value;
                this.setData({
                        resume: _resume
                    })
                    //   $.toast('修改成功', this)
            }
        }
    } else if (data.event_type == 'add') {
        let _this = this;
        let app = getApp();
        console.log(`resume/get${_key.substring(0,1).toUpperCase()+_key.substring(1)}`);
        app.resume(`resume/get${_key.substring(0,1).toUpperCase()+_key.substring(1)}`, 'GET', {
            resume_id: data.value.resume_id
        }).then((res) => {
            if (res.data) {
                _resume[_key] = res.data;
                _this.setData({
                        resume: _resume
                    })
                    //   $.toast('修改成功', this)
            }
        })
    } else {
        _resume[_key].forEach((val, index) => {
            if (val.id == data.value.id) {
                _resume[_key].splice(index, 1);
                this.setData({
                        resume: _resume
                    })
                    //   $.toast('修改成功', this)
            }
        })
    }
}

function inArray(value, arr) {
    for (let t in arr) {
        if (arr[t] == value)
            return true;
    }
    return false;
}

module.exports = {
    on: on,
    emit: emit,
    remove: remove,
    cb: cb,
    events: events
}


// event.on('resumeChanged', this, function(data) {
// 	if (data.key != 'interships') {
// 		return;
// 	} else {
// 		_this.data.interships.forEach((val, index) => {
// 			if (val.id == data.value.id) {
// 				let _interships = this.data.interships;
// 				_interships[index] = data.value;
// 				this.setData({
// 					interships: _interships
// 				})
// 			}
// 		})
// 	}
// })
// event.on('resumeDeleted', this, function(data) {
// 	if (data.key != 'interships') {
// 		return;
// 	} else {
// 		let _interships = this.data.interships;
// 		_interships.forEach((val, index) => {
// 			if (val.id == data.value.id) {
// 				_interships.splice(index, 1);
// 				this.setData({
// 					interships: _interships
// 				})
// 			}
// 		})
// 	}
// })
// event.on('resumeAdded', this, (data) => {
// 	if (data.key != 'interships') {
// 		return;
// 	} else {
// 		let _interships = this.data.interships;
// 		data.value['id'] = _interships.length;
// 		_interships.push(data.value);
// 		this.setData({
// 			interships: _interships
// 		})
// 	}
// })