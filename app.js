//����express�м��
var express = require('express');
var app = express();

//ָ���������������ĸ��ļ��У������ָ����dist�ļ���
app.use(express.static('./dist'));

//�����˿�Ϊ3000
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
