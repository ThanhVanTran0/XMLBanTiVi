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

	//Ghi dữ liệu xuống file 
	Luu_du_lieu(Du_Lieu) {
		var ChuoiDuLieu = new XMLSerializer().serializeToString(Du_Lieu);
		try {
            fs.writeFileSync(Duong_dan_du_lieu,ChuoiDuLieu,"utf-8");
            return true; 
        } catch (error) {
            return false;
        }
	}

}

var Xu_ly = new XL_LUU_TRU;
module.exports = Xu_ly;