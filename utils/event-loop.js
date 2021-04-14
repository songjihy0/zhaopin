/*!
 * event-loop.js
 * lazy化input触发的ajax 只执行最后的input触发的ajax 默认0.5s
 * @date 2017-03-20
 * @author linrui
 */

let loop = [];

function push(name, self, data, cb, delay = 500) {
	let index = loop.push({
		name: name,
		self: self,
		cb: cb,
		data,
	}) - 1;
	setTimeout(function() {
		run(index);
	}, delay)
}

function run(index) {
	if (index == loop.length - 1) {
		loop[index].cb.call(loop[index].self, loop[index].data);
		clean(loop[index].name);
		return;
	}
	for (let i = loop.length - 1; i > index; i--) {
		if (loop[i].name === loop[index].name) {
			return;
		}
	}
	loop[index].cb.call(loop[index].self, loop[index].data);
	clean(loop[index].name);
}

function clean(name) {
	loop = loop.filter((val, index) => {
		return val.name != name;
	})
}

module.exports = {
	push: push
}