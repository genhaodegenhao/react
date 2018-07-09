var baseUrl = 'https://ebd.99bill.com/coc-bill-api';
module.exports = {
    apiUrl: {
        qrCodeQuery: baseUrl + '/csb/qrcode/query',//二维码查询
        erpQuery: baseUrl + '/msf/erp/query',//ERP查询
        orderQuery: baseUrl + '/csb/order/query',//订单查询
    }
}