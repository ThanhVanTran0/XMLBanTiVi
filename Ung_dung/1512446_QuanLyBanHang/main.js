var Data;

var nhomTivi_SLT = [];
var nhomTivi = [];
var doanhthu_Tivi = [];
var doanhthu_NhomTivi = [];
var ngaytk = [];

/*
function GetData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            var text = this.responseText;
            parser = new DOMParser();
            var xml = parser.parseFromString(text,"text/html");
            Data = xml.getElementsByTagName("Tivi");
            showDateOption(Data);
            onChanging();
        }
    };
    xhttp.open("GET", "../Database/Du_lieu.xml", true);
    xhttp.send();
}*/

function GetData() {
    var http = new XMLHttpRequest()
    http.open("POST", "http://localhost:8080?cmd=readfile", true)

    http.setRequestHeader("Content-type", "text/plain")

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200)
        {
            console.log("Response received")
            var xml = (new DOMParser()).parseFromString(http.response,'text/html')
            Data = xml.getElementsByTagName("Tivi");
            showDateOption(Data);
            onChanging();
        }
        else
        if (http.status == 500)
        {
            console.log("Can't read file from server")
        }
    }

    http.send()
}

function dateCreate(Danh_sach_Mat_hang)
{
    var length = Danh_sach_Mat_hang.length;
    for(var i = 0;i<length;i++)
    {
        var len = Danh_sach_Mat_hang[i].getElementsByTagName("Ban_hang").length;
        for(var j = 0;j<len;j++)
        {
            var key = false;
            for(var k = 0 ;k<ngaytk.length;k++)
            {
                var dt = Danh_sach_Mat_hang[i].getElementsByTagName("Ban_hang")[j].getAttribute("Ngay");
                if(ngaytk[k] == dt)
                {
                    key = true;
                    break;
                }
            }
            if (key==false)
            {
                ngaytk.push(Danh_sach_Mat_hang[i].getElementsByTagName("Ban_hang")[j].getAttribute("Ngay"));
            }
        }
    }
    for(var i = 0 ;i<ngaytk.length-1;i++)
    {
        for(var j = i ;j<ngaytk.length;j++)
        {
            if (ngaytk[i]>ngaytk[j])
            {
                var tmp = ngaytk[i];
                ngaytk[i] = ngaytk[j];
                ngaytk[j] = tmp;
            }
        }
    }
}

function showDateOption(Danh_sach_Mat_hang)
{
    dateCreate(Danh_sach_Mat_hang);
    var slt = document.getElementById("slt_date");
    slt.innerHTML="";
    for(var i = 0 ;i<ngaytk.length;i++)
    {
        var index = document.createElement("option");
        index.innerHTML = ngaytk[i];
        slt.appendChild(index);
    }
}

function calRevenue_Tivi(Danh_sach_Mat_hang)
{
    var length = Danh_sach_Mat_hang.length;
    var Select = document.getElementById("slt_date");
    doanhthu_Tivi=[];
    for(var i = 0;i<length;i++)
    {
        var len = Danh_sach_Mat_hang[i].getElementsByTagName("Ban_hang").length;
        var key = false;
        for(var j = 0;j<len;j++)
        {
            for(var k = 0 ;k<ngaytk.length;k++)
            {
                var dt = Danh_sach_Mat_hang[i].getElementsByTagName("Ban_hang")[j].getAttribute("Ngay");
                var slt_dt = Select.options[Select.selectedIndex].value;
                if(dt == slt_dt)
                {
                    key = true;

                    if(doanhthu_Tivi[i] == null){
                        doanhthu_Tivi.push(parseInt(Danh_sach_Mat_hang[i].getElementsByTagName("Ban_hang")[j].getAttribute("Tien")));
                    }
                    else{
                        doanhthu_Tivi[i]+=parseInt(Danh_sach_Mat_hang[i].getElementsByTagName("Ban_hang")[j].getAttribute("Tien"));
                    }
                    
                }
            }
        }
        if (key == false)
        {
            doanhthu_Tivi.push("0");
        }
    }
}

function createInterface_Tivi(Danh_sach_Mat_hang){
    var Dia_chi_Media="../Media/"
    var Th_Danh_sach=document.createElement("table")

    calRevenue_Tivi(Danh_sach_Mat_hang);

    var length = Danh_sach_Mat_hang.length;
    var header ="";
    header=document.createElement("tr");
    header.innerHTML = `
    <th style="width:10px">STT</th>
    <th style="width:150px">Tên</th>
    <th style="width:200px">Hình Minh Họa</th>
    <th style="width:50px">Đơn Giá Bán</th>
    <th style="width:50px">Số Lượng Tồn</th>
    <th style="width:50px">Doanh thu</th>`;

    Th_Danh_sach.appendChild(header)

    for(var i = 0 ; i<length;i++)
    {   
        var Th_STT=document.createElement("td");
        Th_STT.innerHTML= i+1;
        
        var Th_Ten=document.createElement("td")
        Th_Ten.innerHTML= Danh_sach_Mat_hang[i].getAttribute("Ten");

        var Th_Pic=document.createElement("img")      
        Th_Pic.src= Dia_chi_Media + Danh_sach_Mat_hang[i].getAttribute("Ma_so") + ".png"

        var Th_Hinh =document.createElement("td")
        Th_Hinh.appendChild(Th_Pic)

        var Th_GiaNhap =document.createElement("td")
        Th_GiaNhap.innerHTML = Danh_sach_Mat_hang[i].getAttribute("Don_gia_Nhap");

        var Th_Soluongton = document.createElement("td")
        if (Danh_sach_Mat_hang[i].getAttribute("So_luong_Ton")==null)
        {
            Th_Soluongton.innerHTML="0";
        }
        else{
            Th_Soluongton.innerHTML=Danh_sach_Mat_hang[i].getAttribute("So_luong_Ton");
        }

        var Th_DoanhThu =document.createElement("td")
        Th_DoanhThu.innerHTML = doanhthu_Tivi[i];
       
        var Th_Mat_hang=document.createElement("tr")
        Th_Mat_hang.appendChild(Th_STT)
        Th_Mat_hang.appendChild(Th_Ten)
        Th_Mat_hang.appendChild(Th_Hinh)
        Th_Mat_hang.appendChild(Th_GiaNhap)
        Th_Mat_hang.appendChild(Th_Soluongton)
        Th_Mat_hang.appendChild(Th_DoanhThu)
        Th_Danh_sach.appendChild(Th_Mat_hang)

    }
    return Th_Danh_sach
}

function calInventory(Danh_sach_Mat_hang)
{
    var length = Danh_sach_Mat_hang.length;
    nhomTivi = [];
    nhomTivi_SLT = [];
    for(var i = 0 ; i<length;i++)
    {
        var key = false;

        for(var j = 0; j < nhomTivi.length;j++)
        {
            if(nhomTivi[j] == Danh_sach_Mat_hang[i].getElementsByTagName("Nhom_Tivi")[0].getAttribute("Ma_so"))
            {
                key = true;
                if (Danh_sach_Mat_hang[i].getAttribute("So_luong_Ton") != null){
                    nhomTivi_SLT[j]+=parseInt(Danh_sach_Mat_hang[i].getAttribute("So_luong_Ton"),10);
                }
                
                break;
            }
        }
        if (key==false)
        {
            nhomTivi.push(Danh_sach_Mat_hang[i].getElementsByTagName("Nhom_Tivi")[0].getAttribute("Ma_so"));
            if (Danh_sach_Mat_hang[i].getAttribute("So_luong_Ton") != null){
                nhomTivi_SLT.push(parseInt(Danh_sach_Mat_hang[i].getAttribute("So_luong_Ton")));
            }else{
                nhomTivi_SLT.push(0);
            }
        }
    }
}

function calRevenue_NhomTivi(Danh_sach_Mat_hang)
{
    var length = Danh_sach_Mat_hang.length;
    var Select = document.getElementById("slt_date");
    doanhthu_NhomTivi=[];
    for(var i = 0;i<nhomTivi.length;i++)
    {
        doanhthu_NhomTivi.push(0);
    }
    for(var i = 0;i<length;i++)
    {
        var len = Danh_sach_Mat_hang[i].getElementsByTagName("Ban_hang").length;
        var key = false;
        var type = Danh_sach_Mat_hang[i].getElementsByTagName("Nhom_Tivi")[0].getAttribute("Ma_so");
        var type_index;
        for (var t = 0; t<nhomTivi.length;t++)
        {
            if(nhomTivi[t]==type)
            {
                type_index=t;
                break;
            }
                
        }
        for(var j = 0;j<len;j++)
        {
            for(var k = 0 ;k<ngaytk.length;k++)
            {
                var dt = Danh_sach_Mat_hang[i].getElementsByTagName("Ban_hang")[j].getAttribute("Ngay");
                var slt_dt = Select.options[Select.selectedIndex].value;
                if(dt == slt_dt)
                {
                    key = true;
                    doanhthu_NhomTivi[type_index]+=parseInt(Danh_sach_Mat_hang[i].getElementsByTagName("Ban_hang")[j].getAttribute("Tien"));
                }
            }
        }
        if (key == false)
        {
            doanhthu_Tivi.push("0");
        }
    }
}

function createInterface_NhomTivi(Danh_sach_Mat_hang){
    var Dia_chi_Media="../Database/Media/"
    var Th_Danh_sach=document.createElement("table")

    calInventory(Danh_sach_Mat_hang);
    calRevenue_NhomTivi(Danh_sach_Mat_hang);

    var length = nhomTivi.length;
    var header ="";
    header=document.createElement("tr");
    header.innerHTML = `
    <th >STT</th>
    <th >Tên nhóm</th>
    <th >Số Lượng Tồn</th>
    <th >Doanh Thu</th>`;

    Th_Danh_sach.appendChild(header)

    for(var i = 0 ; i<length;i++)
    {   
        var Th_STT=document.createElement("td");
        Th_STT.innerHTML= i+1;
        
        var Th_Ten=document.createElement("td")
        Th_Ten.innerHTML= nhomTivi[i];

        var Th_Soluongton = document.createElement("td")
        Th_Soluongton.innerHTML=nhomTivi_SLT[i];

        var Th_DoanhThu = document.createElement("td")
        Th_DoanhThu.innerHTML=doanhthu_NhomTivi[i];

        var Th_Mat_hang=document.createElement("tr")
        Th_Mat_hang.appendChild(Th_STT)
        Th_Mat_hang.appendChild(Th_Ten)
        Th_Mat_hang.appendChild(Th_Soluongton)
        Th_Mat_hang.appendChild(Th_DoanhThu)
        Th_Danh_sach.appendChild(Th_Mat_hang)

    }
    return Th_Danh_sach
}

function onChanging()
{
   var Select = document.getElementById("slt");
   if (Select.options[Select.selectedIndex].value == "Tivi")
   {
        var result = document.getElementById("manage");
        result.innerHTML="";
        result.appendChild(createInterface_Tivi(Data));
   }
   else if (Select.options[Select.selectedIndex].value == "Nhóm Tivi"){
        var result = document.getElementById("manage");
        result.innerHTML="";
        result.appendChild(createInterface_NhomTivi(Data));
   }
   else
   {
        var result = document.getElementById("manage");
        result.innerHTML="";
        result.appendChild(createInterface_NhanVien(Data));
   }
}