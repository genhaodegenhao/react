// prName与埋点命名中的项目名保持一致
const h5tPrname = 'agentSign';
// jssdk url地址
const h5tUrl = 'https://oms-cloud.99bill.com/h5/static/h5-track-sdk/assets/js/default-1.0.1.js';

const loadSource = () => {
    window._h5t_prname = h5tPrname;
    return new Promise((resolve) => {
        const h5tsdk = document.createElement('script');
        h5tsdk.src = h5tUrl;
        const s = document.getElementsByTagName('script')[0];
        if (s.src === h5tUrl) { // 避免重复加载
            s.onload = () => {
                resolve();
            };
        } else {
            s.parentNode.insertBefore(h5tsdk, s);
            h5tsdk.onload = () => {
                resolve();
            };
        }
    });
};

const checkH5t = () => {
    return new Promise((resolve) => {
        if (window._h5t) {
            resolve();
        } else {
            loadSource().then(() => { // 如果window._h5t不存在，则先加载资源
                resolve();
            });
        }
    });
};

const h5t = {
    init() {
        checkH5t();
    },
    track(type, data) {
        try {
            checkH5t().then(() => {
                window._h5t.track(type, data);
            });
        } catch (e) {
            console.log('h5t error');
        }
    },
};

module.exports = h5t;
