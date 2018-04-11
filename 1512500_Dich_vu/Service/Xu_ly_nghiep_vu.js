var DOMParser = require('xmldom').DOMParser;
var nodeParser = require("./nodeParser.js");

class XL_Nghiep_Vu {
	Tinh_tong_doanh_thu(Danh_sach_ban, ngay_ban) {
		var data = Danh_sach_ban.getElementsByTagName("Ban_hang");
		var length = data.length;
		var DoanhThu = 0;
		for (var i = 0; i < length; i++) {
			var ngay = data[i].getAttribute('Ngay');
			if(ngay_ban === 'all' || this.fn_DateCompare(ngay,ngay_ban) === 0) {
				var Tien = data[i].getAttribute("Tien");
				DoanhThu = DoanhThu + parseInt(Tien);
			}
		}
		return DoanhThu;
	}

	//Cắt bỏ phần danh sách bán và danh sách nhập hàng, tính doanh thu của mỗi mặt hàng;
	Cat_giam_du_lieu(Du_Lieu, doanhthu, ngay_ban) {
		var data = Du_Lieu.getElementsByTagName("Tivi");
		var length = data.length;
		var Du_lieu_cat_giam = new DOMParser().parseFromString('<Du_lieu></Du_lieu>', 'text/xml').documentElement;
		var CuaHang = Du_Lieu.childNodes[1].cloneNode(true);
		var dsTV = new DOMParser().parseFromString('<Danh_sach_Tivi></Danh_sach_Tivi>', 'text/xml').documentElement;
		for (var i = 0; i < length; i++) {
			var newNodeTV = nodeParser.CopyNodeTiVi(data[i]);
			var ban_hang = data[i].getElementsByTagName("Danh_sach_Ban_hang")[0];
			if (doanhthu === 'true') {
				var doanhThu = this.Tinh_tong_doanh_thu(ban_hang, ngay_ban);
				var t = "<Doanh_Thu>" + doanhThu + "</Doanh_Thu>";
				var Doanh_Thu = new DOMParser().parseFromString(t, "text/xml").documentElement;
				newNodeTV.appendChild(Doanh_Thu);
			}
			dsTV.appendChild(newNodeTV);
		}
		Du_lieu_cat_giam.appendChild(CuaHang);
		Du_lieu_cat_giam.appendChild(dsTV);
		return Du_lieu_cat_giam;
	}

	//Cập nhật đơn giá bán
	CapNhatDonGia(Du_Lieu, Loai_don_gia, Ma_so, Don_gia_moi) {
		var dsTV = Du_Lieu.getElementsByTagName("Tivi");
		var length = dsTV.length;
		Ma_so = Ma_so.toLowerCase();
		for (var i = 0; i < length; i++) {
			var maso = dsTV[i].getAttribute("Ma_so").toLowerCase();
			if (maso.localeCompare(Ma_so) == 0) {
				dsTV[i].setAttribute(Loai_don_gia, Don_gia_moi);
				return true;
			}
		}
		return false;
	}
	//So sánh ngày tháng
	fn_DateCompare(DateA, DateB) {
		var a = new Date(DateA);
		var b = new Date(DateB);

		var msDateA = Date.UTC(a.getFullYear(), a.getMonth() + 1, a.getDate());
		var msDateB = Date.UTC(b.getFullYear(), b.getMonth() + 1, b.getDate());

		if (parseFloat(msDateA) < parseFloat(msDateB))
			return -1;
		else if (parseFloat(msDateA) == parseFloat(msDateB))
			return 0;
		else if (parseFloat(msDateA) > parseFloat(msDateB))
			return 1;
		else
			return null;
	}

	//Thêm một danh sách bán hàng mới
	ThemVaCapNhatDanhSachBan(Du_Lieu,ma_so,so_luong_ban,ngay_ban) {
		var dsTV = Du_Lieu.getElementsByTagName("Tivi");
		ma_so = ma_so.toLowerCase();
		for(var i =0 ;i< dsTV.length ;i++) {
			var maso = dsTV[i].getAttribute("Ma_so").toLowerCase();
			if (maso.localeCompare(ma_so) == 0) {
				var so_luong_ton = dsTV[i].getAttribute("So_luong_Ton");
				var so_luong_ton_moi = so_luong_ton - so_luong_ban;
				dsTV[i].setAttribute("So_luong_Ton",so_luong_ton_moi);
				var don_gia = dsTV[i].getAttribute("Don_gia_Ban");
				var tien = don_gia*so_luong_ban;
				//Tao ra mot node ban hang
				var newNodeBanHang = new DOMParser().parseFromString('<Ban_hang/>','text/xml').documentElement;
				newNodeBanHang.setAttribute('Ngay',ngay_ban); 
				newNodeBanHang.setAttribute('Don_gia',don_gia);
				newNodeBanHang.setAttribute('So_luong',so_luong_ban);
				newNodeBanHang.setAttribute('Tien',tien);
				dsTV[i].getElementsByTagName("Danh_sach_Ban_hang")[0].appendChild(newNodeBanHang);
				return true;
			}
		}
		return false;
	}

	//
	ThemVaCapNhatDanhSachNhap(Du_Lieu,ma_so,so_luong_nhap,ngay_nhap) {
		var dsTV = Du_Lieu.getElementsByTagName("Tivi");
		ma_so = ma_so.toLowerCase();
		for(var i =0 ;i< dsTV.length ;i++) {
			var maso = dsTV[i].getAttribute("Ma_so").toLowerCase();
			if (maso.localeCompare(ma_so) == 0) {
				var don_gia = dsTV[i].getAttribute("Don_gia_Nhap");
				var tien = don_gia*so_luong_nhap;
				//Tao ra mot node nhap hang
				var newNode = new DOMParser().parseFromString('<Nhap_hang/>','text/xml').documentElement;
				newNode.setAttribute('Ngay',ngay_nhap); 
				newNode.setAttribute('Don_gia',don_gia);
				newNode.setAttribute('So_luong',so_luong_nhap);
				newNode.setAttribute('Tien',tien);
				dsTV[i].getElementsByTagName("Danh_sach_Nhap_hang")[0].appendChild(newNode);
				return true;
			}
		}
		return false;
	}
}

var XL = new XL_Nghiep_Vu();
module.exports = XL;