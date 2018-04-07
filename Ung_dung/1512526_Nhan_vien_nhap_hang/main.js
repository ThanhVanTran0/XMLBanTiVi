var productList;
var mediaDir = "../Media";
var productType = [];

function MakeDataTable(mainList, isIntital) {
    try {
        var products = mainList.getElementsByTagName("Tivi");
        var len = products.length
        var newList = document.getElementById("mainGrid");

        for (var i = 0; i < len; i++) {

            var newDiv = document.createElement("div");
            newDiv.className = "grid-item";
            var newElement = document.createElement("div");
            var product = products[i];
            var pID = product.getAttribute("Ma_so");

            newElement.innerHTML = product.getAttribute("Ten") + "<br>" 
            + "Giá: " + product.getAttribute("Don_gia_Nhap") + " VNĐ" + "<br>" + 
            "Số lượng tồn: " + product.getAttribute("So_luong_Ton");

            var newPic = document.createElement("img");
            newPic.src = mediaDir + "/" + pID + ".png";
            newPic.setAttribute("weight", "150");
            newPic.setAttribute("height", "150");

            if (isIntital) {
                var typeStr = product.getElementsByTagName("Nhom_Tivi")[0].getAttribute("Ten");

                for (var j = 0; j <= productType.length; j++) {
                    if (j == productType.length) {
                        productType.push(typeStr);
                        break;
                    } else {
                        if (productType[j] == typeStr)
                            break;
                    }
                }
            }

            newDiv.appendChild(newPic);
            newDiv.appendChild(newElement);
            newList.appendChild(newDiv);
        }

        if (isIntital) {
            productType.sort();
            LoadDataToViewForm(productType);
        }


    } catch (err) {
        console.log(err);
        alert(err);
    }
}

function GetData() {
    var http = new XMLHttpRequest()
    http.open("POST", "http://localhost:8080?cmd=readfile", true)

    http.setRequestHeader("Content-type", "text/plain")

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200)
        {
            console.log("Response received")
            var xmlres = (new DOMParser()).parseFromString(http.response,'text/html')
            LoadDataToPage(xmlres)
        }
        else
        if (http.status == 500)
        {
            console.log("Can't read file from server")
        }
    }

    http.send()
}

function LoadDataToPage(data) {
    try {
        var titleNode = data.getElementsByTagName("Cua_hang")[0];
        productList = data.getElementsByTagName("Danh_sach_Tivi")[0];

        document.getElementById("title").innerHTML = titleNode.getAttribute("Ten"); //Write Title
        document.getElementById("logo").src = mediaDir + "/" + titleNode.getAttribute("Ma_so") + ".png"; //Write Title

        MakeDataTable(productList, true);
    } catch (err) {
        console.log(err);
        alert(err);
    }
}

function LoadDataToViewForm(typelist) {
    var form = document.getElementById("viewForm");
    for (var i = 0; i < typelist.length; i++) {
        var choice = document.createElement("input");
        choice.type = "checkbox";
        choice.style = "margin:5px";
        choice.setAttribute("checked","true");
        choice.name = typelist[i];
        //console.log(choice);
        var label = document.createElement("label");
        label.style = "font-size:18px";

        var newDiv = document.createElement("div");
        newDiv.class = "checkbox";

        label.appendChild(choice);
        label.innerHTML += typelist[i];
        
        newDiv.appendChild(label);
        form.insertBefore(newDiv, form.lastElementChild);
    }

}

function ChangeView() {
    //Remove old content
    var div = document.getElementById('mainGrid');
    while (div.firstChild)
        div.removeChild(div.firstChild);

    var checkedArray = [];
    var checkBoxes = document.getElementById("viewForm").getElementsByTagName("input");

    for (var i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked)
            checkedArray.push(checkBoxes[i].name);
    }

    //console.log(checkedArray);
    var newList = productList.cloneNode(true);
    var products = newList.getElementsByTagName("Tivi");

    for (var i = 0; i < products.length; i++) {
        var type = products[i].getElementsByTagName("Nhom_Tivi")[0].getAttribute("Ten");

        if (checkedArray.indexOf(type) < 0) {
            newList.removeChild(products[i]);
            i--;
        }
    }

    MakeDataTable(newList, false);
    //  console.log(productList.children.length);
    //  console.log(newList.children.length);
}

function ChangeGrid() {
    var num = document.getElementById("gridSelect").selectedIndex;
    try {
        var newGridStr = "";
        switch (num) {
            case 0:
                newGridStr = "auto";
                break;
            case 1:
                newGridStr = "auto auto auto";
                break;
            case 2:
                newGridStr = "auto auto auto auto auto";
                break;
            case 3:
                newGridStr = "auto auto auto auto auto auto";
                break;
        }

        document.getElementById("mainGrid").style.gridTemplateColumns = newGridStr;
    } catch (err) {
        console.log(err);
        alert(err);
    }

}