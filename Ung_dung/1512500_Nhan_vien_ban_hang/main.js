const MediaPath = "../Media/";

function get_Du_lieu_XML() {
    var http = new XMLHttpRequest()
    http.open("POST", "http://localhost:3000/thaotac=read&doc=danhsach", false);
    http.setRequestHeader("Content-type", "text/plain");
    http.send("");
    var Chuoi_XML = http.responseText;
    var Data = new DOMParser().parseFromString(Chuoi_XML,"text/xml");
    return Data;
}

function get_Danh_Sach_Ban_Nhap_Hang(id,Danh_sach_can_lay) {
    var http = new XMLHttpRequest();
    var Chuoi_query = "http://localhost:3000/thaotac=read&doc="+ Danh_sach_can_lay +"&id="+id;
    console.log(Chuoi_query);

    http.open("POST",Chuoi_query,false);
    http.setRequestHeader("Content-type","text/plain");
    http.send("");

    var Chuoi_XML = http.responseText;
    var Data = new DOMParser().parseFromString(Chuoi_XML,"text/xml");
    Data = Data.getElementsByTagName("Ban_hang");
    return Data;
}

function Tao_Danh_Sach(Danh_sach_mat_hang) {
    var length = Danh_sach_mat_hang.length;
    var check = true;
    var dem = 0 ;
    var row;
    var Danh_sach = document.createElement("div");
    Danh_sach.className = "grid-container";
    Danh_sach.style.gridTemplateColumns = "auto auto auto auto"; 
    for(var i = 0;i<length;i++) {
        var newDiv = document.createElement("div");
        newDiv.className = "grid-item";
        var Image = document.createElement("img");
        var Id = Danh_sach_mat_hang[i].getAttribute("Ma_so");

        Image.src = MediaPath + Id + ".png";
        Image.style = "height:150px;weight:150px";

        var ThongTin = document.createElement("div");
        var Ten = Danh_sach_mat_hang[i].getAttribute("Ten");
        var DonGia = Danh_sach_mat_hang[i].getAttribute("Don_gia_Nhap");
        var SoLuongTon = Danh_sach_mat_hang[i].getAttribute("So_luong_Ton");
        var Danh_sach_ban_hang = get_Danh_Sach_Ban_Nhap_Hang(Id,"danhSachBan");
        var Doanh_thu  = tinh_Tong_Doanh_Thu(Danh_sach_ban_hang);

        ThongTin.innerHTML = "Tên: " + Ten + "<br> Mã số: "+ Id + "<br>Đơn giá: " + DonGia + "<br>Số lượng tồn: "+SoLuongTon + "<br>Doanh thu: " +Doanh_thu;

        newDiv.appendChild(Image);
        newDiv.appendChild(ThongTin);
        Danh_sach.appendChild(newDiv);
    }
    return Danh_sach;
}

//Thêm loại sản phảm vào select
function add_Loai_San_Pham(Danh_sach_mat_hang) {
    var LOAI_SP = document.getElementById("LOAI_SP");
    var length = Danh_sach_mat_hang.length;
    var DS_SP = [];
    var check;
    for(var i=0;i<length;i++) {
        var NhomTV = Danh_sach_mat_hang[i].childNodes[1];
        var mssp = NhomTV.getAttribute("Ma_so");

        check = false;
        for(var j = 0;j<DS_SP.length;j++) {
            if(mssp.localeCompare(DS_SP[j]) == 0 )
            {
                check = true;
                break;
            }
        }

        if(check == false) {
            var option = document.createElement("option");
            option.innerHTML = NhomTV.getAttribute("Ten");
            option.value = mssp;
            LOAI_SP.appendChild(option);
            DS_SP.push(mssp);
        }
    }
}

function tinh_So_Luong_ton(Danh_sach_mat_hang,MSSP) {
    var length = Danh_sach_mat_hang.length;
    var Tong_so_luong_Ton = 0;
    var mssp;
    for(var i=0;i<length;i++) {
        var ThongTin = Danh_sach_mat_hang[i].childNodes[1];
        mssp  = ThongTin.getAttribute("Ma_so");
        if(MSSP.localeCompare(mssp)==0 || MSSP.localeCompare("all")==0) {
            var So_luong_Ton = Danh_sach_mat_hang[i].getAttribute("So_luong_Ton");
            if(So_luong_Ton!=null) {
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
    for(var i=0;i<length;i++) {
        var ThongTin = Danh_sach_mat_hang[i].childNodes[1];
        mssp  = ThongTin.getAttribute("Ma_so");
        if(MSSP.localeCompare(mssp)==0 || MSSP.localeCompare("all")==0) {
            var node = Danh_sach_mat_hang[i].cloneNode(true);
            Danh_sach.appendChild(node);
        }
    }
    Danh_sach =Danh_sach.getElementsByTagName("Tivi");
    return Danh_sach;
}

//Tính tổng doanh thu theo danh sách bán hàng của một mặt hàng
function tinh_Tong_Doanh_Thu(Danh_sach_ban_hang) {
    var length = Danh_sach_ban_hang.length;
    var Tong_Doanh_Thu = 0;
    for(var i=0;i<length;i++) {
        var tien = Danh_sach_ban_hang[i].getAttribute("Tien");
        Tong_Doanh_Thu = Tong_Doanh_Thu + parseInt(tien);
    }
    return Tong_Doanh_Thu;
}

//Lấy ra đơn giá bán theo mã số mặt hàng
function Tim_don_gia_theo_ma_so(Danh_sach,MSSP) {
    var Don_gia =-1;
    var length = Danh_sach.length;
    MSSP = MSSP.toLowerCase();
    for(var i=0; i<length; i++) {
        var Ma_so = Danh_sach[i].getAttribute("Ma_so").toLowerCase();
        if(MSSP.localeCompare(Ma_so) == 0) {
            Don_gia = parseInt(Danh_sach[i].getAttribute("Don_gia_Ban"));
            break;
        }
    }
    return Don_gia;
}

//Bắt sự thay đổi của select, xuất số lượng tồn và danh sách theo nhóm tivi
function onChanging() {
    var SO_LUONG_TON = document.getElementById("SO_LUONG_TON");
    var LOAI_SP = document.getElementById("LOAI_SP");
    var mssp = LOAI_SP.value;
    SO_LUONG_TON.innerHTML = tinh_So_Luong_ton(Danh_sach,mssp);
    var Danh_sach2 = Tao_Danh_sach_mat_hang_theo_ma_so(Danh_sach,mssp);
    KET_QUA.innerHTML = "";
    KET_QUA.appendChild(Tao_Danh_Sach(Danh_sach2));        
}

//Tính tiền theo đơn giá của tivi, chưa lưu file nên tạm thời xuất ra danh sách
function Tinh_Tien() {
    var ho_ten = HO_TEN.value;
    var ngay_ban = NGAY.value;
    var so_luong_ban = parseInt(SO_LUONG_BAN.value);
    var ma_so = MA_SO.value;
    var Tong_tien = 0;

    if (isNaN(so_luong_ban)) {
        alert("Số lượng nhập chưa chính xác");
    }
    else {
        if (so_luong_ban < 0) {
            alert("Số lượng nhập chưa chính xác");
        }
        else {
            var Don_gia = Tim_don_gia_theo_ma_so(Danh_sach, ma_so);
            if (Don_gia == -1) {
                alert("Không tìm thấy sản phẩm nào có mã như đã nhập!");
            }
            else {
                Tong_tien = so_luong_ban * Don_gia;

                var row = document.createElement("div");
                row.className = "row";

                var col1 = document.createElement("div");
                col1.className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center";
                col1.innerHTML = ma_so;

                var col2 = document.createElement("div");
                col2.className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center";
                col2.innerHTML = so_luong_ban;

                var col3 = document.createElement("div");
                col3.className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center";
                col3.innerHTML = Don_gia;

                var col4 = document.createElement("div");
                col4.className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 text-center";
                col4.innerHTML = Tong_tien;

                row.appendChild(col1);
                row.appendChild(col2);
                row.appendChild(col3);
                row.appendChild(col4);

                THONG_TIN_PHIEU_BAN.appendChild(row);
            }
        }
    }
}

//Xóa dữ liệu bán hàng
function XoaDuLieuBan() {
    THONG_TIN_PHIEU_BAN.innerHTML = "";
}