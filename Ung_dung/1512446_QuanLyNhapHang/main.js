var Data;

var nhomTivi_SLT = [];
var nhomTivi = [];


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

/*
function GetData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            var text = this.responseText;
            parser = new DOMParser();
            var xml = parser.parseFromString(text,"text/html");
            Data = xml.getElementsByTagName("Tivi");
            onChanging();
        }
    };
    xhttp.open("GET", "../Database/Du_lieu.xml", true);
    xhttp.send();
}
*/


function createInterface_Tivi(Danh_sach_Mat_hang){
    var Dia_chi_Media="../Media/"
    var Th_Danh_sach=document.createElement("table")

    var length = Danh_sach_Mat_hang.length;
    var header ="";
    header=document.createElement("tr");
    header.innerHTML = `
    <th >STT</th>
    <th >Tên</th>
    <th >Hình Minh Họa</th>
    <th >Đơn Giá Nhập</th>
    <th >Số Lượng Tồn</th>`;

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

       
        var Th_Mat_hang=document.createElement("tr")
        Th_Mat_hang.appendChild(Th_STT)
        Th_Mat_hang.appendChild(Th_Ten)
        Th_Mat_hang.appendChild(Th_Hinh)
        Th_Mat_hang.appendChild(Th_GiaNhap)
        Th_Mat_hang.appendChild(Th_Soluongton)
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

function createInterface_NhomTivi(Danh_sach_Mat_hang){
    var Dia_chi_Media="../Database/Media/"
    var Th_Danh_sach=document.createElement("table")

    calInventory(Danh_sach_Mat_hang);

    var length = nhomTivi.length;
    var header ="";
    header=document.createElement("tr");
    header.innerHTML = `
    <th >STT</th>
    <th >Tên nhóm</th>
    <th >Số Lượng Tồn</th>`;

    Th_Danh_sach.appendChild(header)

    for(var i = 0 ; i<length;i++)
    {   
        var Th_STT=document.createElement("td");
        Th_STT.innerHTML= i+1;
        
        var Th_Ten=document.createElement("td")
        Th_Ten.innerHTML= nhomTivi[i];

        var Th_Soluongton = document.createElement("td")
        Th_Soluongton.innerHTML=nhomTivi_SLT[i];

        var Th_Mat_hang=document.createElement("tr")
        Th_Mat_hang.appendChild(Th_STT)
        Th_Mat_hang.appendChild(Th_Ten)
        Th_Mat_hang.appendChild(Th_Soluongton)
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
   else{
        var result = document.getElementById("manage");
        result.innerHTML="";
        result.appendChild(createInterface_NhomTivi(Data));
   }
}