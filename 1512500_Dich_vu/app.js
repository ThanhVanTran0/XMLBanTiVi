var http = require('http');
var fs = require('fs');
var Luu_tru = require("./Service/Xu_ly_luu_tru.js");
var port = 3000;
var Xu_ly_tham_so = require('querystring');

var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var ParseDOMToXML = new XMLSerializer();

var Du_lieu = Luu_tru.Doc_du_lieu(); //Du lieu dung de thao tac trong qua trinh gui;
var Du_Lieu_Goc = Luu_tru.Doc_du_lieu(); // Du_lieu_dung de cap nhat va ghi file khi co su thay doi tu client
var Du_lieu = Luu_tru.Cat_giam_du_lieu(Du_lieu);

var Dich_vu = http.createServer((req,res) => {
	//console.log(`${req.method} ${req.url}`);
	// var Chuoi_kq = 
	// console.log(Chuoi_kq);

	var req_url = req.url.replace("/","");
	var tham_so = Xu_ly_tham_so.parse(req_url);
	console.log(tham_so);
	var thao_tac = tham_so.thaotac;
	var Chuoi_kq;
	if(thao_tac === 'read') {
		var doc = tham_so.doc;
		if(doc === 'danhsach') { //
			Chuoi_kq = ParseDOMToXML.serializeToString(Du_lieu);
			console.log("Tra ve du lieu da cat gon");
		}
		else 
		{
			var id = tham_so.id;
			if(doc === 'danhSachBan') {
				var danhSachBan = Luu_tru.Lay_danh_sach_ban_hang(Du_Lieu_Goc,id);
				Chuoi_kq = ParseDOMToXML.serializeToString(danhSachBan);
				console.log('Tra ve danh sach ban hang');
			}
			else if(doc === 'danhSachNhap') {

				console.log('Tra ve danh sach nhap')
			}
		}
	}
	else {
		if(thao_tac === 'write') {
			
		}
		else if(thao_tac = '...') {
			Chuoi_kq = '...';
		}
	}
	res.setHeader("Access-Control-Allow-Origin", '*')
    res.end(Chuoi_kq);
}).listen(port,(err)=>{
	if(err!=null)
		console.log("==> Error" + err);
	else 
		console.log("Server is starting at port 3000");
});
