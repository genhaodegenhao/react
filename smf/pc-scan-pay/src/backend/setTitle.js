const setTitle = function (str) {
    setTimeout(function () {
        //利用iframe的onload事件刷新页面
        document.title = str;
        var iframe = document.createElement('iframe');
        iframe.style.visibility = 'hidden';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.src = "/favicon.ico";
        iframe.onload = function () {
            setTimeout(function () {
                document.body.removeChild(iframe);
            }, 0);
        };
        document.body.appendChild(iframe);
    }, 0);
}

export default setTitle;
