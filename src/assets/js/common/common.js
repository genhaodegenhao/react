/**
 * author:shimin.chen.wb;
 * time:2017/7/14;
 * description:公共js;
 */
import $ from 'jquery';
var isCheckAll = false;
var utils = {
    baseUrl:'http://192.168.47.40:8109/app-rip-wd-movie-intra',//本地调试
    //baseUrl:'https://192.168.8.124/rip-wd-movie-intra',
    // baseUrl:window.location.protocol+"//"+window.location.hostname+"/rip-wd-movie-intra",//线上
    formatCSTDate:function(strDate,format){
        return utils.formatDate(new Date(strDate),format);
    },
    //格式化日期,
    formatDate:function(date,format){
        var paddNum = function(num){
            num += '';
            return num.replace(/^(\d)$/,"0$1");
        };
        
        //指定格式字符
        var cfg = {
            yyyy : date.getFullYear() //年 : 4位
            ,yy : date.getFullYear().toString().substring(2)//年 : 2位
            ,M  : date.getMonth() + 1  //月 : 如果1位的时候不补0
            ,MM : paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
            ,d  : date.getDate()   //日 : 如果1位的时候不补0
            ,dd : paddNum(date.getDate())//日 : 如果1位的时候补0
            ,h : date.getHours() //时:如果1位不补0
            ,hh : paddNum(date.getHours())//时:如果1位补0
            ,m : date.getMinutes() //分:如果1位不补0
            ,mm : paddNum(date.getMinutes()) //分:如果1位补0
            ,s : date.getSeconds() //秒:如果1位不补0
            ,ss : paddNum(date.getSeconds()) //秒:如果1位补0
          };
        format || (format = "yyyy-MM-dd hh:mm:ss");
        return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
    },
    /**
     *  全选和取消全选事件
     */
    toggleSelect: function(event){
        //checkbox 全选/取消全选
        if (isCheckAll) {
            $("input[type='checkbox']").each(function() {
                this.checked = false;
            });
            isCheckAll = false;
        } else {
            $("input[type='checkbox']").each(function() {
                this.checked = true;
            });
            isCheckAll = true;
        }
    }
};
export default utils;