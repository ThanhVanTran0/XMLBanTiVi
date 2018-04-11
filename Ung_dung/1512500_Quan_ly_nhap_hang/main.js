const MediaPath = "../Media/";
var Danh_sach;


function get_Du_lieu_XML() {
    var http = new XMLHttpRequest()
    http.open("POST", "http://localhost:3001/cmd=read&mode=danhsach", false);
    http.setRequestHeader("Content-type", "text/plain");
    http.send("");
    
    var Chuoi_XML = http.responseText;
    var Data = new DOMParser().parseFromString(Chuoi_XML,"text/xml");
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
        
        ThongTin.innerHTML = "Tên: " + Ten + "<br> Mã số: "+ Id +"<br>Đơn giá: " + DonGia + "<br>Số lượng tồn: "+SoLuongTon;

        newDiv.appendChild(Image);
        newDiv.appendChild(ThongTin);
        Danh_sach.appendChild(newDiv);
    }
    return Danh_sach;
}

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
    for(var i=0;i<length;i++) {
        var NhomTV = Danh_sach_mat_hang[i].getElementsByTagName("Nhom_Tivi")[0];
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
        var ThongTin = Danh_sach_mat_hang[i].getElementsByTagName("Nhom_Tivi")[0];
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

function Tao_Danh_sach_mat_hang_theo_ma_so(Danh_sach_mat_hang, MSSP) {
    var length = Danh_sach_mat_hang.length;
    var Danh_sach = document.createElement("Danh_sach");
    var mssp;
    for(var i=0;i<length;i++) {
        var ThongTin = Danh_sach_mat_hang[i].getElementsByTagName("Nhom_Tivi")[0];
        mssp  = ThongTin.getAttribute("Ma_so");
        if(MSSP.localeCompare(mssp)==0 || MSSP.localeCompare("all")==0) {
            var node = Danh_sach_mat_hang[i].cloneNode(true);
            Danh_sach.appendChild(node);
        }
    }
    Danh_sach =Danh_sach.getElementsByTagName("Tivi");
    return Danh_sach;
}

function KiemTraMaSo(Danh_sach,MSSP) {
    var length = Danh_sach.length;
    MSSP = MSSP.toLowerCase();
    for(var i=0; i<length; i++) {
        var Ma_so = Danh_sach[i].getAttribute("Ma_so").toLowerCase();
        if(MSSP.localeCompare(Ma_so) == 0) {
            return true;
            break;
        }
    }
    return false;
}

function CapNhatLenServer(ma_so,DonGia) {
    var http = new XMLHttpRequest();
    var Query = "http://localhost:3001/cmd=modify&id="+ma_so+"&nhap="+DonGia;
    http.open("POST",Query,true);

    http.onreadystatechange = function() {
        if (this.readyState == 4 ) {
            if(this.status == 200) {
                NapDuLieuBanDau();
                alert("Cập nhật thành công");
            }
            else {
                alert('Server lỗi ghi dữ liệu, vui lòng reload lại trang');
            }
        }
    }

    http.setRequestHeader("Content-type", "text/plain");
    http.send("");
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

function onChanging() {
    var SO_LUONG_TON = document.getElementById("SO_LUONG_TON");
    var LOAI_SP = document.getElementById("LOAI_SP");
    var mssp = LOAI_SP.value;
    SO_LUONG_TON.innerHTML = tinh_So_Luong_ton(Danh_sach,mssp);
    var Danh_sach2 = Tao_Danh_sach_mat_hang_theo_ma_so(Danh_sach,mssp);
    KET_QUA.innerHTML = "";
    KET_QUA.appendChild(Tao_Danh_Sach(Danh_sach2));        
}

function CapNhatDonGia() {
    var ma_so = MA_SO_SP.value;
    if(KiemTraMaSo(Danh_sach,ma_so)==false) 
    {
        alert('Mã số sản phẩm nhập không chính xác.');
    }
    else {
        var DonGia = parseInt(DON_GIA_NHAP_SP.value);
        if(isNaN(DonGia) || DonGia <= 0) {
            alert("Đơn giá phải là số lớn hơn 0");
        }
        else {
            CapNhatLenServer(ma_so,DonGia);
        }
    }
}