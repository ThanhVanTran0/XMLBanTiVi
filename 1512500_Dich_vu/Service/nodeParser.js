var DOMParser = require('xmldom').DOMParser;


class XL_NODE {
	//Copy node tivi thanh node moi ma khong tao danh sach ban
	CopyNodeTiVi(data) {
		var node = new DOMParser().parseFromString('<Tivi></Tivi>',"text/xml").documentElement;
		var lengthAttribute = data.attributes.length;
		for(var i = 0;i<lengthAttribute;i++) {
			node.setAttribute(data.attributes[i].nodeName,data.attributes[i].nodeValue);
		} 
		var nhomTV = data.childNodes[1].cloneNode(true);
		node.appendChild(nhomTV);
		return node;
	}
}

var nodeParser = new XL_NODE();
module.exports = nodeParser;