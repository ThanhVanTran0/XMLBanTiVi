const MediaPath = "../Media/";

function get_Du_lieu_XML() {
    var http = new XMLHttpRequest()
    http.open("POST", "http://localhost:8080?cmd=readfile", false);
    http.setRequestHeader("Content-type", "text/plain");
    http.send("");
    
    var Chuoi_XML = http.responseText;
    var Data = new DOMParser().parseFromString(Chuoi_XML,"text/xml");
    // var Danh_sach_mat_hang = Data.getElementsByTagName("Tivi");
    // console.log(Danh_sach_mat_hang.length);
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
