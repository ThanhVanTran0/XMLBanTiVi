var http = require('http');
var fs = require('fs');
var Luu_tru = require("./Service/Xu_ly_luu_tru.js");
var XL_NV = require("./Service/Xu_ly_nghiep_vu.js");
var port = 3001;
var Xu_ly_tham_so = require('querystring');

var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var ParseDOMToXML = new XMLSerializer();

var Du_Lieu = Luu_tru.Doc_du_lieu();
//cmd=read&mode=doanhthu&date=(all/ngaycuthe)
var Dich_vu = http.createServer((req, res) => {

	var req_url = req.url.replace("/", "");
	var tham_so = Xu_ly_tham_so.parse(req_url);
	var cmd = tham_so.cmd;
	var Du_lieu_cat_giam = null;
	var Chuoi_kq;

	if (cmd === 'read') {
		var mode = tham_so.mode;
		if (mode === 'danhsach') { //
			Du_lieu_cat_giam = XL_NV.Cat_giam_du_lieu(Du_Lieu, 'false', '');
		} else {
			var ngay_ban = tham_so.date;
			Du_lieu_cat_giam = XL_NV.Cat_giam_du_lieu(Du_Lieu, 'true', ngay_ban);
		}


		Chuoi_kq = ParseDOMToXML.serializeToString(Du_lieu_cat_giam);
		console.log("Tra ve du lieu da cat gon");
		res.setHeader("Access-Control-Allow-Origin", '*')
		res.end(Chuoi_kq);
	} else if (cmd === 'modify') { //cmd=modify&id=TIVI_x&nhap=___&xuat=___
		var ma_so = tham_so.id;
		var Don_gia_nhap = tham_so.nhap;
		if (Don_gia_nhap != null) {
			var kt = XL_NV.CapNhatDonGia(Du_Lieu, 'Don_gia_Nhap', ma_so, Don_gia_moi);
			if (kt == true) {
				if (Luu_tru.Luu_du_lieu(Du_Lieu)) {
					res.writeHead(200, {
						'Content-Type': 'text/plain',
						'Access-Control-Allow-Origin': '*'
					});
					res.end();
				}
			} else {
				var Don_gia_ban = tham_so.xuat;
				if (Don_gia_ban != null) {
					var kt = XL_NV.CapNhatDonGia(Du_Lieu, 'Don_gia_Nhap', ma_so, Don_gia_moi);
					if (kt == true) {
						if (Luu_tru.Luu_du_lieu(Du_Lieu)) {
							res.writeHead(200, {
								'Content-Type': 'text/plain',
								'Access-Control-Allow-Origin': '*'
							});
							res.end();
						}
					}
				}
			}
		}
	}
	else if(cmd === 'write') {
		var mode = tham_so.mode;
		if(mode === 'bhang') {

		}
		else if(mode === 'nhang') {
			
		}
	}
}).listen(port, (err) => {
	if (err != null)
		console.log("==> Error" + err);
	else
		console.log("Server is starting at port 3001");
});
