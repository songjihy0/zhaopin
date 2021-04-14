const animation = '-webkit-animation: ripple 1s cubic-bezier(0, 0, 0.2, 1); animation: ripple 1s cubic-bezier(0, 0, 0.2, 1);'

function ripple(e) {
    let { target, flag } = e.currentTarget.dataset;
    let { offsetLeft, offsetTop } = e.currentTarget;
    let { pageX, pageY } = e.changedTouches[0];
    let ripple = this.data.ripple;

    if (flag && flag == 'fixed') { //绝对定位
        ripple[target] = 'top:20px ; left:' + (pageX - offsetLeft - 20) + 'px;' + animation
    } else {
        ripple[target] = 'top:' + (pageY - offsetTop - 20) + 'px ; left:' + (pageX - offsetLeft - 20) + 'px;' + animation
    }
    this.setData({
        ripple: ripple
    })
    setTimeout(function(target) {
        let ripple = this.data.ripple;
        ripple[target] = ''
        this.setData({
            ripple: ripple
        })
    }.bind(this, target), 1000)
}
module.exports = {
    ripple: ripple
}
