const MediaPath = "../Media/";

function get_Du_lieu_XML() {
    var http = new XMLHttpRequest()
    http.open("POST", "http://localhost:3001/cmd=read&mode=doanhthu&date=all", false);
    http.setRequestHeader("Content-type", "text/plain");
    http.send("");
    var Chuoi_XML = http.responseText;
    var Data = new DOMParser().parseFromString(Chuoi_XML, "text/xml");
    return Data;
}

function Tao_Danh_Sach(Danh_sach_mat_hang) {
    var length = Danh_sach_mat_hang.length;
    var check = true;
    var dem = 0;
    var row;
    var Danh_sach = document.createElement("div");
    Danh_sach.className = "grid-container";
    Danh_sach.style.gridTemplateColumns = "auto auto auto auto";
    for (var i = 0; i < length; i++) {
        var newDiv = document.createElement("div");
        newDiv.className = "grid-item";
        var Image = document.createElement("img");
        var Id = Danh_sach_mat_hang[i].getAttribute("Ma_so");

        Image.src = MediaPath + Id + ".png";
        Image.style = "height:150px;weight:150px";

        var ThongTin = document.createElement("div");
        var Ten = Danh_sach_mat_hang[i].getAttribute("Ten");
        var DonGia = Danh_sach_mat_hang[i].getAttribute("Don_gia_Ban");
        var SoLuongTon = Danh_sach_mat_hang[i].getAttribute("So_luong_Ton");
        var Doanh_thu = Danh_sach_mat_hang[i].getElementsByTagName("Doanh_Thu")[0].childNodes[0].nodeValue;

        ThongTin.innerHTML = "Tên: " + Ten + "<br> Mã số: " + Id + "<br>Đơn giá bán: " + DonGia + "<br>Số lượng tồn: " + SoLuongTon + "<br>Doanh thu: " + Doanh_thu;

        newDiv.appendChild(Image);
        newDiv.appendChild(ThongTin);
        Danh_sach.appendChild(newDiv);
    }
    return Danh_sach;
}

//Thêm loại sản phảm vào select
function add_Loai_San_Pham(Danh_sach_mat_hang) {
    var LOAI_SP = document.getElementById("LOAI_SP");
    LOAI_SP.innerHTML = "";
    var optionTatCa = document.createElement('option');
    optionTatCa.innerHTML = 'Tất cả';
    optionTatCa.value = 'all';
    optionTatCa.setlected = 'setlected';
    LOAI_SP.appendChild(optionTatCa);

    var length = Danh_sach_mat_hang.length;
    var DS_SP = [];
    var check;
    for (var i = 0; i < length; i++) {
        var NhomTV = Danh_sach_mat_hang[i].getElementsByTagName("Nhom_Tivi")[0];
        var mssp = NhomTV.getAttribute("Ma_so");

        check = false;
        for (var j = 0; j < DS_SP.length; j++) {
            if (mssp.localeCompare(DS_SP[j]) == 0) {
                check = true;
                break;
            }
        }

        if (check == false) {
            var option = document.createElement("option");
            option.innerHTML = NhomTV.getAttribute("Ten");
            option.value = mssp;
            LOAI_SP.appendChild(option);
            DS_SP.push(mssp);
        }
    }
}

function tinh_So_Luong_ton(Danh_sach_mat_hang, MSSP) {
    var length = Danh_sach_mat_hang.length;
    var Tong_so_luong_Ton = 0;
    var mssp;
    for (var i = 0; i < length; i++) {
        var ThongTin = Danh_sach_mat_hang[i].getElementsByTagName("Nhom_Tivi")[0];
        mssp = ThongTin.getAttribute("Ma_so");
        if (MSSP.localeCompare(mssp) == 0 || MSSP.localeCompare("all") == 0) {
            var So_luong_Ton = Danh_sach_mat_hang[i].getAttribute("So_luong_Ton");
            if (So_luong_Ton != null) {
                Tong_so_luong_Ton = Tong_so_luong_Ton + parseInt(So_luong_Ton);
            }
        }
    }

    return Tong_so_luong_Ton;
}

//
function Tao_Danh_sach_mat_hang_theo_ma_so(Danh_sach_mat_hang, MSSP) {
    var length = Danh_sach_mat_hang.length;
    var Danh_sach = document.createElement("Danh_sach");
    var mssp;
    for (var i = 0; i < length; i++) {
        var ThongTin = Danh_sach_mat_hang[i].getElementsByTagName("Nhom_Tivi")[0];
        mssp = ThongTin.getAttribute("Ma_so");
        if (MSSP.localeCompare(mssp) == 0 || MSSP.localeCompare("all") == 0) {
            var node = Danh_sach_mat_hang[i].cloneNode(true);
            Danh_sach.appendChild(node);
        }
    }
    Danh_sach = Danh_sach.getElementsByTagName("Tivi");
    return Danh_sach;
}

//Lấy ra đơn giá bán theo mã số mặt hàng
function Tim_don_gia_va_so_luong_ton(Danh_sach, MSSP) {
    var Don_gia = -1;
    var So_Luong_Ton;
    var length = Danh_sach.length;
    MSSP = MSSP.toLowerCase();
    for (var i = 0; i < length; i++) {
        var Ma_so = Danh_sach[i].getAttribute("Ma_so").toLowerCase();
        if (MSSP.localeCompare(Ma_so) == 0) {
            Don_gia = parseInt(Danh_sach[i].getAttribute("Don_gia_Ban"));
            So_Luong_Ton = Danh_sach[i].getAttribute("So_luong_Ton");
            break;
        }
    }
    return [Don_gia,So_Luong_Ton];
}

//Bắt sự thay đổi của select, xuất số lượng tồn và danh sách theo nhóm tivi
function onChanging() {
    var SO_LUONG_TON = document.getElementById("SO_LUONG_TON");
    var LOAI_SP = document.getElementById("LOAI_SP");
    var mssp = LOAI_SP.value;
    SO_LUONG_TON.innerHTML = tinh_So_Luong_ton(Danh_sach, mssp);
    var Danh_sach2 = Tao_Danh_sach_mat_hang_theo_ma_so(Danh_sach, mssp);
    KET_QUA.innerHTML = "";
    KET_QUA.appendChild(Tao_Danh_Sach(Danh_sach2));
}

//Tính tiền theo đơn giá của tivi
function Tinh_Tien() {
    var ho_ten = HO_TEN.value;
    var ngay_ban = NGAY.value;
    var so_luong_ban = parseInt(SO_LUONG_BAN.value);
    var ma_so = MA_SO.value;
    var Tong_tien = 0;

    if (isNaN(so_luong_ban) || so_luong_ban < 0) {
        alert("Số lượng nhập chưa chính xác");
    }
    else {
        var temp = Tim_don_gia_va_so_luong_ton(Danh_sach, ma_so);
        var Don_gia = temp[0];
        if (Don_gia == -1) {
            alert("Không tìm thấy sản phẩm nào có mã như đã nhập!");
        }
        else {
            var So_Luong_Ton = temp[1];
            if(So_Luong_Ton === null || So_Luong_Ton === '0')
            {
                alert('Sản phẩm cần mua đã hết hàng!');
            }
            else if(So_Luong_Ton < so_luong_ban) {
                alert('Hiện tại cửa hàng không đủ số lượng yêu cầu.');
            }
            else { 
                CapNhatLenServer(ma_so,Don_gia,ngay_ban,so_luong_ban);
            }
        }
    }
}

function XoaDuLieuBan() {
    HO_TEN.value = "";
    SO_LUONG_BAN.value = "";
    MA_SO.value = "";
}

function NapDuLieuBanDau() {
        var Root = get_Du_lieu_XML();
        var CuaHang = Root.getElementsByTagName("Cua_hang")[0];
        TEN_CUA_HANG.innerHTML = CuaHang.getAttribute("Ten");

        Danh_sach = Root.getElementsByTagName("Tivi");
        add_Loai_San_Pham(Danh_sach);
        SO_LUONG_TON.innerHTML = tinh_So_Luong_ton(Danh_sach, "all");
        KET_QUA.innerHTML = "";
        KET_QUA.appendChild(Tao_Danh_Sach(Danh_sach));
}

function CapNhatLenServer(ma_so,don_gia,ngay_ban,so_luong_ban) {
    var http = new XMLHttpRequest();
    var query = "http://localhost:3001/cmd=write&mode=bhang&id="+ma_so+"&date="+ngay_ban+"&num="+so_luong_ban;
    http.open("POST",query,true);

    http.onreadystatechange = function() {
        if (this.readyState == 4 ) {
            if(this.status == 200) {
                var TongTienPhaiTra = don_gia * so_luong_ban;
                NapDuLieuBanDau();
                alert("Cập nhật thành công, số tiền phải trả là: " + TongTienPhaiTra);
            }
            else {
                alert('Server lỗi ghi dữ liệu, vui lòng reload lại trang');
            }
        }
    }

    http.setRequestHeader("Content-type", "text/plain");
    http.send("");
}