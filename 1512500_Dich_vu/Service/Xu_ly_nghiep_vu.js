var DOMParser = require('xmldom').DOMParser;
var nodeParser  = require("./nodeParser.js");

class XL_Nghiep_Vu {
	Tinh_tong_doanh_thu(Danh_sach_ban) {
		var data = Danh_sach_ban.getElementsByTagName("Ban_hang");
		var length = data.length;
		var DoanhThu = 0;
		for(var i = 0 ;i< length;i++) {
			var Tien = data[i].getAttribute("Tien");
			DoanhThu = DoanhThu + parseInt(Tien);
		}
		return DoanhThu;
	}

	//Cắt bỏ phần danh sách bán và danh sách nhập hàng, tính doanh thu của mỗi mặt hàng;
	Cat_giam_du_lieu(Du_Lieu,doanhthu,ngay_ban) {
		var data = Du_Lieu.getElementsByTagName("Tivi");
		var length = data.length;
		var Du_lieu_cat_giam = new DOMParser().parseFromString('<Du_lieu></Du_lieu>','text/xml').documentElement;
		var CuaHang = Du_Lieu.childNodes[1].cloneNode(true);
		var dsTV = new DOMParser().parseFromString('<Danh_sach_Tivi></Danh_sach_Tivi>','text/xml').documentElement;
		for( var i= 0;i< length;i++) {
			var newNodeTV = nodeParser.CopyNodeTiVi(data[i]);
			var ban_hang = data[i].getElementsByTagName("Danh_sach_Ban_hang")[0];
			if(doanhthu === 'true') {
				var doanhThu = this.Tinh_tong_doanh_thu(ban_hang);
				var t = "<Doanh_Thu>" + doanhThu + "</Doanh_Thu>";
				var Doanh_Thu = new DOMParser().parseFromString(t,"text/xml").documentElement;
				newNodeTV.appendChild(Doanh_Thu);
			}			
			dsTV.appendChild(newNodeTV);
		}
		Du_lieu_cat_giam.appendChild(CuaHang);
		Du_lieu_cat_giam.appendChild(dsTV);
		return Du_lieu_cat_giam;
	}

	CapNhatDonGia(Du_Lieu,Loai_don_gia,Ma_so,Don_gia_moi) {
		var dsTV = Du_Lieu.getElementsByTagName("Tivi");
		var length = dsTV.length;
		Ma_so = Ma_so.toLowerCase();
		for(var i = 0 ;i< length ;i++) {
			var maso = dsTV[i].getAttribute("Ma_so").toLowerCase();
			if(maso.localeCompare(Ma_so) == 0) {
				dsTV[i].setAttribute(Loai_don_gia,Don_gia_moi);
				return true;
			}
		}
		return false;
	}

}

var XL = new XL_Nghiep_Vu();
module.exports = XL;