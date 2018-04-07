var fs = require("fs");
var Duong_dan_du_lieu = "./Du_lieu.xml"
console.log(Duong_dan_du_lieu);
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require("xmldom").XMLSerializer;

class XL_LUU_TRU {
	//Dọc dữ liệu của xml
	Doc_du_lieu() {
		var Chuoi_XML = fs.readFileSync(Duong_dan_du_lieu,"utf-8");
		var Du_Lieu = new DOMParser().parseFromString(Chuoi_XML,"text/xml").documentElement;
		return Du_Lieu;
	}

	//Cắt bỏ phần danh sách bán và danh sách nhập hàng;
	Cat_giam_du_lieu(Du_Lieu) {
		var tmp = Du_Lieu.childNodes[3];
		var data = tmp.getElementsByTagName("Tivi");
		var length = data.length;
		console.log(length);
		for( var i= 0;i< length;i++) {
			var ban_hang = data[i].getElementsByTagName("Danh_sach_Ban_hang")[0];
			ban_hang.parentNode.removeChild(ban_hang);

			var nhap_hang = data[i].getElementsByTagName("Danh_sach_Nhap_hang")[0];
			nhap_hang.parentNode.removeChild(nhap_hang);
		}
		return Du_Lieu;
	}
	// Lấy danh sách bán hàng

	Lay_danh_sach_ban_hang(Du_Lieu,id) {
		var data = Du_Lieu.getElementsByTagName("Tivi");
		var length = data.length;
		for(var i =0;i<length;i++) {
			var ID = data[i].getAttribute("Ma_so");
			if(id === ID) {
				return data[i].childNodes[3];
			}
		}
		return null;
	}

}

var Xu_ly = new XL_LUU_TRU;
module.exports = Xu_ly;