var Iccsettimer;//计时器
var IcclineUpargstate;//排队和状态
var IccSeat;//获取坐席
var IcctimeIndex = 0;
//加载完成执行
window.onload = function () {
    var $regularlyItems = document.getElementsByClassName("first viewport-flip");
    //去掉所谓的翻滚状态
    //IccPhone.each($regularlyItems, function () {
    //    var _$this = this;
    //    _$this.childNodes[0].className = "flip-box flip out";
    //    setTimeout(function () {
    //        _$this.childNodes[1].className = "flip-box flip in";
    //        _$this.childNodes[0].style.display = "none";
    //    }, 225);
    //});
    //hover($regularlyItems[0], function () {
    //    var _$this = this;
    //    _$this.childNodes[1].className = "flip-box flip out";
    //    setTimeout(function () {
    //        _$this.childNodes[0].className = "flip-box flip in";
    //        _$this.childNodes[0].style.display = "";
    //        _$this.childNodes[1].style.display = "none";
    //    }, 240);
    //}, function () {
    //    var _$this = this;
    //    _$this.childNodes[0].className = "flip-box flip out";
    //    setTimeout(function () {
    //        _$this.childNodes[1].className = "flip-box flip in";
    //        _$this.childNodes[1].style.display = "";
    //        _$this.childNodes[0].style.display = "none";
    //    }, 240);
    //});
}

//签入操作
function checkIn() {
    //先做链接然后再做签入
    //先赋值
    wsk.txtseatno = IccPhone.options.seatNo;
    wsk.txtstation = IccPhone.options.seatExt;
    wsk.txtpassowrd = IccPhone.options.seatPassWord;
    if (!wsk.isConnect) {
        wsk.init(IccPhone.options.iccSerVicePath);
    }
    else {
        wsk.checkIn();
    }
}

//签出
function checkOut() {
    //签出操作
    wsk.checkOut();
}

//拨号
function callTel() {
    var txtObj = document.getElementById("Icctxttel");
    if (txtObj != undefined) {
        var tel = txtObj.value;
        //if (/^1[3|4|5|7|8]\d{9}$/i.test(tel)) {
        wsk.makeCall(tel, '');
        //}
        //else {
        //    alert("请在文本框中输入正确的手机号码");
        //    txtObj.focus();
        //}
    }
    else {
        alert("请在初始化【items】,加上['txtTel']");
    }
}

//挂机操作
function dropTel() {
    wsk.dropCall();
}

//最早版本三方通话- 2.1.10 版本后舍弃 edit by 王沪丰
//function threeCall() {
//    var txtObj = document.getElementById("Icctxttel");
//    if (txtObj != undefined) {
//        var tel = txtObj.value;
//        if (tel != "") {
//            wsk.Callauther(tel);
//        }
//        else {
//            alert("请在文本框中输入第三方的号码");
//            txtObj.focus();
//        }
//    }
//    else {
//        alert("请在初始化【items】,加上['txtTel']");
//    }
//}

//新版三方会议功能
var oMask;
function threeMeet() {
    CloseWin();
    oMask = document.createElement('div');
    oMask.id = 'Iccmask';
    //获取页面的高度和宽度
    var pageHeight = document.documentElement.scrollHeight;
    var pageWidth = document.documentElement.scrollWidth;
    oMask.style.left = (pageWidth - 380) / 2 + 'px';
    oMask.style.top = (pageHeight - 280) / 2 + 'px';
    //头部div
    var titleDiv = document.createElement('div');
    titleDiv.id = "titleDiv"
    titleDiv.innerHTML = "&nbsp;三方会议";
    //头部加上右边关闭按钮
    var colseA = document.createElement('a');
    colseA.className = "whfAClose icon-zuofei color-white";
    colseA.setAttribute("onclick", "CloseWin()");
    titleDiv.appendChild(colseA);
    oMask.appendChild(titleDiv);
    //内容div
    var conDiv = document.createElement('div');
    conDiv.id = "conDiv";
    //内容里面加控件等操作
    var titleSpan = document.createElement('span');
    titleSpan.id = "titleSpan";
    titleSpan.innerText = "第三方号码：";
    conDiv.appendChild(titleSpan);
    var txtthreemeet = document.createElement('input');
    txtthreemeet.id = "txtthreemeet";
    txtthreemeet.name = "txtthreemeet";
    conDiv.appendChild(txtthreemeet);
    PhonecreateLink("btnthreeMeet", conDiv, "StopCall()", "Icc-l-btn whfthree", "外线拨号", "Icc-l-btn-icon-left icon-cc-huawu")
    PhonecreateLink("btnthreeMeetExit", conDiv, "dropTel()", "Icc-l-btn whfthree", "挂机退出", "Icc-l-btn-icon-left icon-guanbi")
    PhonecreateLink("btnthreeMeetTwo", conDiv, "StopCallTwo()", "Icc-l-btn whfthree", "外线并线", "Icc-l-btn-icon-left icon-cc-sanfang")
    PhonecreateLink("btnthreeMeetThree", conDiv, "StopCallThree()", "Icc-l-btn whfthree", "三方并线", "Icc-l-btn-icon-left icon-cc-sanfang")
    PhonecreateLink("btnInsideCall", conDiv, "InsideCall()", "Icc-l-btn whfthree", "内线拨号", "Icc-l-btn-icon-left icon-cc-sanfang")
    PhonecreateLink("btnInsideMeet", conDiv, "InsideMeet()", "Icc-l-btn whfthree", "内线并线", "Icc-l-btn-icon-left icon-cc-sanfang")
    oMask.appendChild(conDiv);
    document.body.appendChild(oMask);
}
//移除窗体
function CloseWin() {
    if (oMask != undefined) {
        document.body.removeChild(oMask);
        oMask = undefined;
    }
}
//新版三方通话功能
var nMask;
function threeParts() {
    CloseNWin();
    nMask = document.createElement('div');
    nMask.id = 'nIccmask';
    //获取页面的高度和宽度
    var pageHeight = document.documentElement.scrollHeight;
    var pageWidth = document.documentElement.scrollWidth;
    nMask.style.left = (pageWidth - 490) / 2 + 'px';
    nMask.style.top = (pageHeight - 280) / 2 + 'px';
    //头部div
    var titleDiv = document.createElement('div');
    titleDiv.id = "titleDiv"
    titleDiv.innerHTML = "&nbsp;三方通话";
    //头部加上右边关闭按钮
    var colseA = document.createElement('a');
    colseA.className = "whfAClose icon-zuofei color-white";
    colseA.setAttribute("onclick", "CloseNWin()");
    titleDiv.appendChild(colseA);
    nMask.appendChild(titleDiv);
    //内容div
    var conDiv = document.createElement('div');
    conDiv.id = "nconDiv";
    var ThreeTel = IccPhone.options.ThreeTel;
    for (var i = 0, j = ThreeTel.length; i < j; i++) {
        var titleSpan = document.createElement('span');
        titleSpan.className = "BlockSpan";
        titleSpan.setAttribute("onclick", "CallThreeBack('" + ThreeTel[i] + "')");
        titleSpan.innerText = ThreeTel[i];
        conDiv.appendChild(titleSpan);
    }
    var noqbutton = document.createElement('div');
    noqbutton.className = "noqbutton";
    var nospan = document.createElement("span");
    nospan.innerText = "无快捷转接,可在下方输入框输入后点击确认按钮";
    noqbutton.appendChild(nospan);
    conDiv.appendChild(noqbutton);

    var txtpara = document.createElement('input');
    txtpara.id = "txtpara";
    txtpara.name = "txtpara";
    txtpara.type = "text";
    conDiv.appendChild(txtpara);

    var node = document.createElement("a");
    node.href = "javascript:void(0);";
    node.setAttribute("onclick", "CallThreeSure()");
    node.className = "Icc-l-btn whflink OkSure";
    conDiv.appendChild(node);
    //内容部分
    var node1 = document.createElement("span");
    node1.className = "Icc-l-btn-left Icc-l-btn-icon-top";
    node.appendChild(node1);
    //文本部门
    var node2 = document.createElement("span");
    node2.className = "Icc-l-btn-text";
    var Text = "确认";
    node2.appendChild(document.createTextNode(Text));
    node1.appendChild(node2);
    //图标部分
    var node3 = document.createElement("span");
    node3.className = "Icc-l-btn-icon icon-wancheng color-shenlan";
    node3.innerHTML = "&nbsp;";
    node1.appendChild(node3);
    nMask.appendChild(conDiv);

    var btnDiv = document.createElement('div');
    btnDiv.id = "nbtnDiv";
    PhonecreateLink("btnSelfExit", btnDiv, "CallautherStop(0)", "Icc-l-btn threeExit", "本人退出", "Icc-l-btn-icon-left icon-guanbi");
    PhonecreateLink("btnCusExit", btnDiv, "CallautherStop(1)", "Icc-l-btn threeExit", "客户退出", "Icc-l-btn-icon-left icon-heimingdanguanli");
    PhonecreateLink("btnThreeExit", btnDiv, "CallautherStop(2)", "Icc-l-btn threeExit", "第三方退出", "Icc-l-btn-icon-left icon-lizhi");
    PhonecreateLink("btnExit", btnDiv, "CallautherStop(3)", "Icc-l-btn threeExit", "结束三方通话", "Icc-l-btn-icon-left icon-roundclose");
    nMask.appendChild(btnDiv);

    document.body.appendChild(nMask);
}
//移除窗体
function CloseNWin() {
    if (nMask != undefined) {
        document.body.removeChild(nMask);
        nMask = undefined;
    }
}
//点击判断存在手机号码
function CallThreeSure() {
    var tel = document.getElementById("txtpara").value;
    if (tel != "") {
        CallThreeBack(tel);
    }
}
//点击号码外拨
function CallThreeBack(Code) {
    if (confirm('确认要转接【' + Code + '】吗?') == true) {
        wsk.Callauther(Code);
    }
}
//三方退出
function CallautherStop(para) {
    //0 坐席退出 1拨入的客户退出 2新加入的退出 3结束本次通话
    wsk.CallautherStop(para);
}

//创建标签通用功能
function PhonecreateLink(_this, _father, OnclickName, className, btntext, iconName) {
    var node = document.createElement("a");
    node.id = _this;
    node.name = _this;
    node.href = "javascript:void(0);";
    node.setAttribute("onclick", OnclickName);
    node.className = className;
    _father.appendChild(node);
    //内容部分
    var node1 = document.createElement("span");
    node1.className = "Icc-l-btn-left";
    node.appendChild(node1);
    //文本部门
    var node2 = document.createElement("span");
    node2.className = "Icc-l-btn-text";
    node2.innerText = btntext;
    node1.appendChild(node2);
    //图标部分
    var node3 = document.createElement("span");
    node3.className = iconName;
    node3.innerHTML = "&nbsp;";
    node1.appendChild(node3);
}
//外线拨号
function StopCall() {
    var tel = document.getElementById("txtthreemeet").value;
    if (tel != "") {
        wsk.StopCall(tel);
    }
    else {
        document.getElementById("txtthreemeet").focus();
    }
}
function StopCallTwo() {
    wsk.StopCallTwo();
}
function StopCallThree() {
    wsk.StopCallThree();
}
//内线拨号
function InsideCall() {
    var tel = document.getElementById("txtthreemeet").value;
    if (tel != "") {
        wsk.InsideCall(tel);
    }
    else {
        document.getElementById("txtthreemeet").focus();
    }
}
function InsideMeet() {
    wsk.InsideMeet();
}
//新增三方会议结束

//转评价
function dialBack() {
    wsk.Callback(1);
}

//强插
function threeTalk() {
    var txtObj = document.getElementById("Icctxttel");
    if (txtObj != undefined) {
        var tel = txtObj.value;
        if (tel != "") {
            wsk.ThreeTalk(tel);
        }
        else {
            alert("请在文本框中输入要强插的分机号");
            txtObj.focus();
        }
    }
    else {
        alert("请在初始化【items】,加上['txtTel']");
    }
}

//强拆
function killTalk() {
    var txtObj = document.getElementById("Icctxttel");
    if (txtObj != undefined) {
        var tel = txtObj.value;
        if (tel != "") {
            wsk.KillTalk(tel);
        }
        else {
            alert("请在文本框中输入要强拆的分机号");
            txtObj.focus();
        }
    }
    else {
        alert("请在初始化【items】,加上['txtTel']");
    }
}

var transDiv;
//转接Ivr
function transIvr() {
    CloseTrans();
    transDiv = document.createElement('div');
    transDiv.id = 'transId';
    var pageHeight = document.documentElement.scrollHeight;
    var pageWidth = document.documentElement.scrollWidth;
    transDiv.style.left = (pageWidth - 380) / 2 + 'px';
    transDiv.style.top = (pageHeight - 280) / 2 + 'px';

    var titleDiv = document.createElement('div');
    titleDiv.id = "titleDiv"
    titleDiv.innerHTML = "&nbsp;转技能组";
    //头部加上右边关闭按钮
    var colseA = document.createElement('a');
    colseA.className = "whfAClose icon-zuofei color-white";
    colseA.setAttribute("onclick", "CloseTrans()");
    titleDiv.appendChild(colseA);
    transDiv.appendChild(titleDiv);
    //内容
    var conDiv = document.createElement('div');
    conDiv.id = "transconDiv";

    var nameSpan = document.createElement('span');
    nameSpan.className = "nameSpan";
    nameSpan.innerText = "选择技能组:";
    conDiv.appendChild(nameSpan);

    var seatselect = document.createElement('select');
    seatselect.id = "seatSelect";
    var myOption = document.createElement("option");
    myOption.value = "";
    myOption.text = "请选择";
    seatselect.add(myOption);
    var IccIvrArr = IccPhone.IccIvrArr;

    for (var i = 0, j = IccIvrArr.length; i < j; i++) {
        var SelOption = document.createElement("option");
        SelOption.value = IccIvrArr[i][0];
        SelOption.text = IccIvrArr[i][1];
        seatselect.add(SelOption);
    }

    conDiv.appendChild(seatselect);

    transDiv.appendChild(conDiv);
    var btnDiv = document.createElement('div');
    btnDiv.id = "transbtnDiv";
    PhonecreateLink("btnSave", btnDiv, "sureTransGroup()", "Icc-l-btn threeExit", "确认转技能组", "Icc-l-btn-icon-left icon-save");

    transDiv.appendChild(btnDiv);
    document.body.appendChild(transDiv);
}
//获取Ivr数据
function SetIvr(arr) {
    var IvrArr = arr.split('|');
    for (var i = 0, j = IvrArr.length; i < j; i++) {
        IccPhone.IccIvrArr[i] = new Array();
        var nIvr = IvrArr[i].split('=');
        IccPhone.IccIvrArr[i][0] = nIvr[0];
        IccPhone.IccIvrArr[i][1] = nIvr[1];
    }
}
//确认转技能组
function sureTransGroup() {
    var val = document.getElementById("seatSelect").value;
    if (val != "") {
        wsk.GotoGroup(val);
        CloseTrans();
    }
}
//转接坐席
function transSeatno() {
    CloseTrans();
    transDiv = document.createElement('div');
    transDiv.id = 'transId';
    var pageHeight = document.documentElement.scrollHeight;
    var pageWidth = document.documentElement.scrollWidth;
    transDiv.style.left = (pageWidth - 380) / 2 + 'px';
    transDiv.style.top = (pageHeight - 280) / 2 + 'px';

    var titleDiv = document.createElement('div');
    titleDiv.id = "titleDiv"
    titleDiv.innerHTML = "&nbsp;转坐席";
    //头部加上右边关闭按钮
    var colseA = document.createElement('a');
    colseA.className = "whfAClose icon-zuofei color-white";
    colseA.setAttribute("onclick", "CloseTrans()");
    titleDiv.appendChild(colseA);
    transDiv.appendChild(titleDiv);
    //内容
    var conDiv = document.createElement('div');
    conDiv.id = "transconDiv";

    var nameSpan = document.createElement('span');
    nameSpan.className = "nameSpan";
    nameSpan.innerText = "选择坐席:";
    conDiv.appendChild(nameSpan);

    var seatselect = document.createElement('select');
    seatselect.id = "seatSelect";
    var myOption = document.createElement("option");
    myOption.value = "";
    myOption.text = "请选择";
    seatselect.add(myOption);
    var IccSeatArr = IccPhone.IccSeatArr;

    for (var i = 0, j = IccSeatArr.length; i < j; i++) {
        var SelOption = document.createElement("option");
        SelOption.value = IccSeatArr[i][0];
        SelOption.text = IccSeatArr[i][1];
        seatselect.add(SelOption);
    }

    conDiv.appendChild(seatselect);

    transDiv.appendChild(conDiv);
    var btnDiv = document.createElement('div');
    btnDiv.id = "transbtnDiv";
    PhonecreateLink("btnSave", btnDiv, "sureTransSeatno()", "Icc-l-btn threeExit", "确认转坐席", "Icc-l-btn-icon-left icon-save");

    transDiv.appendChild(btnDiv);
    document.body.appendChild(transDiv);
}
//获取坐席数据
function SetSeatNo(arr) {
    var seatArr = arr.split('|');
    for (var i = 0, j = seatArr.length; i < j; i++) {
        IccPhone.IccSeatArr[i] = new Array();
        var nseat = seatArr[i].split('=');
        IccPhone.IccSeatArr[i][0] = nseat[0];
        var len = nseat[1].length;
        var state = nseat[1].substring(0, len - 1);
        var word = nseat[1].substring(len - 1, len);
        IccPhone.IccSeatArr[i][1] = nseat[0] + "-" + stateString(state, word);
    }
}
//确认转接
function sureTransSeatno() {
    var val = document.getElementById("seatSelect").value;
    if (val != "") {
        wsk.TransSeatno(val);
        CloseTrans();
    }
}
//转换坐席状态
function stateString(state, word) {
    var result = "";
    switch (state) {//1签入，3通话，0未签入
        case "0": result = "未签入"; break;
        case "1": if (word == "I") { result = "空闲" } else { result = "示忙"; } break;
        case "3": result = "服务中"; break;
    }
    return result;
}

//获取分机数据
function SetExt(arr) {
    var ExtArr = arr.split('|');
    for (var i = 0, j = ExtArr.length; i < j; i++) {
        IccPhone.IccExtArr[i] = ExtArr[i];
    }
}
//转接分机
function transExt() {
    CloseTrans();
    transDiv = document.createElement('div');
    transDiv.id = 'transId';
    var pageHeight = document.documentElement.scrollHeight;
    var pageWidth = document.documentElement.scrollWidth;
    transDiv.style.left = (pageWidth - 380) / 2 + 'px';
    transDiv.style.top = (pageHeight - 280) / 2 + 'px';

    var titleDiv = document.createElement('div');
    titleDiv.id = "titleDiv"
    titleDiv.innerHTML = "&nbsp;转分机";
    //头部加上右边关闭按钮
    var colseA = document.createElement('a');
    colseA.className = "whfAClose icon-zuofei color-white";
    colseA.setAttribute("onclick", "CloseTrans()");
    titleDiv.appendChild(colseA);
    transDiv.appendChild(titleDiv);
    //内容
    var conDiv = document.createElement('div');
    conDiv.id = "transconDiv";

    var nameSpan = document.createElement('span');
    nameSpan.className = "nameSpan";
    nameSpan.innerText = "选择分机:";
    conDiv.appendChild(nameSpan);

    var seatselect = document.createElement('select');
    seatselect.id = "seatSelect";
    var myOption = document.createElement("option");
    myOption.value = "";
    myOption.text = "请选择";
    seatselect.add(myOption);
    var IccExtArr = IccPhone.IccExtArr;

    for (var i = 0, j = IccExtArr.length; i < j; i++) {
        var SelOption = document.createElement("option");
        SelOption.value = IccExtArr[i];
        SelOption.text = IccExtArr[i];
        seatselect.add(SelOption);
    }

    conDiv.appendChild(seatselect);

    transDiv.appendChild(conDiv);
    var btnDiv = document.createElement('div');
    btnDiv.id = "transbtnDiv";
    PhonecreateLink("btnSave", btnDiv, "sureTransExt()", "Icc-l-btn threeExit", "确认转分机", "Icc-l-btn-icon-left icon-save");

    transDiv.appendChild(btnDiv);
    document.body.appendChild(transDiv);
}

function sureTransExt() {
    var val = document.getElementById("seatSelect").value;
    if (val != "") {
        wsk.TransSeatnoNew(val);
        CloseTrans();
    }
}

function CloseTrans() {
    if (transDiv != undefined) {
        document.body.removeChild(transDiv);
        transDiv = undefined;
    }
}

/* 2019-09-16 早期版本空闲功能 在 2.1.10 版本后舍弃 edit by 王沪丰
//空闲->繁忙/繁忙->空闲
function freeCall(seatstate) {
    wsk.SetSeatState(seatstate);
}
//空闲->繁忙
function setbusy(_Id) {
    var Obj = document.getElementById(_Id);
    Obj.setAttribute("onclick", "freeCall(0)");
    Obj.childNodes[0].childNodes[0].innerText = IccPhone.IccText["busyCall"];
}
//繁忙->空闲
function serfree(_Id) {
    var Obj = document.getElementById(_Id);
    Obj.setAttribute("onclick", "freeCall(1)");
    Obj.childNodes[0].childNodes[0].innerText = IccPhone.IccText["freeCall"];
}
*/
var toopDiv;
//空闲鼠标移入事件
function freeMouseOver(_this) {
    freeMouseLeave();
    toopDiv = document.createElement("div");
    toopDiv.id = "busytool";
    //箭头
    var arrowDiv = document.createElement("div");
    arrowDiv.id = "arrow";
    toopDiv.appendChild(arrowDiv);
    var arrowDiv1 = document.createElement("div");
    arrowDiv1.id = "arrow1";
    toopDiv.appendChild(arrowDiv1);
    //内容
    var contDiv = document.createElement("div");
    contDiv.id = "toopCont";
    var BusyNode = IccPhone.IccBusyArr;
    var width = 12;
    for (var i = 0, j = BusyNode.length; i < j; i++) {
        var titleSpan = document.createElement('span');
        titleSpan.className = "freeSpan";
        titleSpan.setAttribute("onclick", "savebusy('" + BusyNode[i][0] + "','" + BusyNode[i][1] + "')");
        titleSpan.innerText = BusyNode[i][1];
        contDiv.appendChild(titleSpan);
        width += 40;
    }
    var left = _this.offsetLeft - width / 2 + _this.clientWidth / 2;
    toopDiv.style.left = left + "px";
    var top = _this.offsetTop + _this.clientHeight + 8;
    toopDiv.style.top = top + "px";
    toopDiv.appendChild(contDiv);
    document.body.appendChild(toopDiv);
    //增加对应的事件
    document.getElementById("busytool").onmouseleave = function () {
        freeMouseLeave();
    }
}
//设置空闲类
function SetBusyNode(arr) {
    var busynode = arr.split('|');
    for (var i = 0, j = busynode.length; i < j; i++) {
        IccPhone.IccBusyArr[i + 1] = new Array();
        var childArr = busynode[i].split('=');
        IccPhone.IccBusyArr[i + 1][0] = childArr[0];
        IccPhone.IccBusyArr[i + 1][1] = Base64.decode(childArr[1]);
    }
}
//空闲鼠标移除事件
function freeMouseLeave() {
    if (toopDiv != undefined) {
        document.body.removeChild(toopDiv);
        toopDiv = undefined;
    }
}
//点击空闲操作
function savebusy(id, text) {
    document.getElementById("whfbusy").childNodes[0].childNodes[0].innerText = text;
    //最新版本能够接受小类的繁忙操作
    wsk.SetSeatState(id);
}

//保持功能
function keepCall(_param) {
    wsk.HoldUser(_param);
}
//恢复功能
function keepRegain(_param) {
    wsk.HoldUser(_param);
}

//静音功能
function keepQuiet(_param) {
    wsk.HoldUser(_param);
}

//保持后对应操作
function keeCallOper(_Fid, _Sid) {
    //保持后静音不可以用,自己隐藏恢复出现
    var _FObj = document.getElementById(_Fid);
    var _SObj = document.getElementById(_Sid);
    _FObj.style.display = "none";
    if (_SObj != undefined) {
        //当主键存在静音功能时
        _SObj.setAttribute("onclick", "");
        addClass(_SObj, "Icc-l-btn-disabled");
    }
    document.getElementById("whfhold01").style.display = "";
}

//保持静音后恢复
function keepRegainOper(_Fid, _Sid) {
    var _FObj = document.getElementById(_Fid);
    var _SObj = document.getElementById(_Sid);
    if (_FObj.style.display == "none") {
        //如果保持是隐藏的
        _FObj.style.display = "";
        if (_SObj != undefined) {
            //当主键存在静音功能时
            _SObj.setAttribute("onclick", IccPhone.IccOnclick[_SObj.name]);
            removeClass(_SObj, "Icc-l-btn-disabled");
        }
        document.getElementById("whfhold01").style.display = "none";
    }
    else {
        _SObj.style.display = "";
        if (_FObj != undefined) {
            _FObj.setAttribute("onclick", IccPhone.IccOnclick[_FObj.name]);
            removeClass(_FObj, "Icc-l-btn-disabled");
        }
        document.getElementById("whfhold02").style.display = "none";
    }
}

//静音后对应操作
function keepQuietOper(_Fid, _Sid) {
    //保持后静音不可以用,自己隐藏恢复出现
    var _FObj = document.getElementById(_Fid);
    var _SObj = document.getElementById(_Sid);
    _FObj.style.display = "none";
    if (_SObj != undefined) {
        //当主键存在静音功能时
        _SObj.setAttribute("onclick", "");
        addClass(_SObj, "Icc-l-btn-disabled");
    }
    document.getElementById("whfhold02").style.display = "";
}

/*2018-01-11 增加功能,操作按钮方法*/
//隐藏签入显示其余按钮
function HideCheckIn(_Id) {
    var selObj = document.getElementById(_Id);
    selObj.setAttribute("onclick", "");
    selObj.className = "whflink Icc-l-btn Icc-l-btn-disabled";
    //addClass(selObj, "Icc-l-btn-disabled");
    var CallNameArr = document.getElementsByClassName("whflink");
    for (var i = 0, j = CallNameArr.length; i < j; i++) {
        if (CallNameArr[i].id != _Id && CallNameArr[i].id != "whfbusy") {
            CallNameArr[i].setAttribute("onclick", IccPhone.IccOnclick[CallNameArr[i].name]);
            CallNameArr[i].className = "whflink Icc-l-btn";
            //removeClass(CallNameArr[i], "Icc-l-btn-disabled")
        }
        if (CallNameArr[i].id == "whfbusy") {
            CallNameArr[i].setAttribute("onmouseenter", IccPhone.IccOnMouseEnter[CallNameArr[i].name]);
            CallNameArr[i].className = "whflink Icc-l-btn";
        }
    }
}
//显示签入隐藏其余按钮
function ShowCheckIn(_Id) {
    var selObj = document.getElementById(_Id);
    selObj.setAttribute("onclick", IccPhone.IccOnclick[selObj.name]);
    selObj.className = "whflink Icc-l-btn";
    //removeClass(selObj, "Icc-l-btn-disabled");
    var CallNameArr = document.getElementsByClassName("whflink");
    for (var i = 0, j = CallNameArr.length; i < j; i++) {
        if (CallNameArr[i].id != _Id && CallNameArr[i].id != "whfbusy") {
            CallNameArr[i].setAttribute("onclick", "");
            CallNameArr[i].className = "whflink Icc-l-btn Icc-l-btn-disabled";
            //addClass(CallNameArr[i], "Icc-l-btn-disabled")
        }
        if (CallNameArr[i].id == "whfbusy") {
            CallNameArr[i].setAttribute("onmouseenter", "");
            CallNameArr[i].className = "whflink Icc-l-btn Icc-l-btn-disabled";
        }
    }
}

/**********************************/

function IccCallin(tel, callId) {
    if (IccPhone.options.isCallinAlert) {
        //配置需要呼入弹屏就弹
        var FnStr = IccPhone.options.CallinFn;
        if (IccPhone.isFunction(FnStr)) {
            FnStr(tel, callId);
        }
        else {
            alert("呼入弹屏-请配置[CallinFn]");
        }
    }
}

function IccCallout(tel, callId) {
    if (IccPhone.options.isCalloutAlert) {
        //配置需要呼入弹屏就弹
        var FnStr = IccPhone.options.CalloutFn;
        if (IccPhone.isFunction(FnStr)) {
            FnStr(tel, callId);
        }
        else {
            alert("呼出弹屏-请配置[CalloutFn]");
        }
    }
}

/*******JS 仿效Jq封装方式**********/
function addClass(obj, cls) {
    var obj_class = obj.className,//获取 class 内容.
    blank = (obj_class != '') ? ' ' : '';//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
    added = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.
    obj.className = added;//替换原来的 class.
}

function removeClass(obj, cls) {
    var obj_class = ' ' + obj.className + ' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' '),//将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
    removed = obj_class.replace(' ' + cls + ' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed;//替换原来的 class.
}

function hasClass(obj, cls) {
    var obj_class = obj.className,//获取 class 内容.
    obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.
    x = 0;
    for (x in obj_class_lst) {
        if (obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
            return true;
        }
    }
    return false;
}

function hover(ele, over, out) {
    ele.addEventListener('mouseenter', over, false);
    ele.addEventListener('mouseleave', out, false);
}
/*******JS 仿效Jq封装方式**********/

//开始计时
function s60Stimer() {
    IcctimeIndex = 1;
    Iccsettimer = setInterval(function () {
        IccsetTime();
    }, 1000);
}

//结束计时
function s60Etimer() {
    clearInterval(Iccsettimer);
}

//计时器方法
function IccsetTime() {
    //var hour = parseInt(IcctimeIndex / 3600);    // 计算时
    var minutes = parseInt((IcctimeIndex % 3600) / 60);    // 计算分
    var seconds = parseInt(IcctimeIndex % 60);    // 计算秒
    //hour = hour < 10 ? "0" + hour : hour;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("IcctimerSpan").innerHTML = (minutes + ":" + seconds);//hour + ":" +
    IcctimeIndex++;
}
//签入成功就开启定时
function s60LineUpStimer() {
    wsk.GetGroupLineUp();
    IcclineUpargstate = setInterval(function () {
        wsk.GetGroupLineUp();
    }, 2000);
    wsk.GetSeatInfo();
    IccSeat = setInterval(function () {
        wsk.GetSeatInfo();
    }, 2000);
    //发起繁忙小类获取
    wsk.GetBusyNode();
    wsk.GetIvrInfo();
    wsk.GetExtInfo();
    document.getElementById("btnSend").style.display = "";
}
//离线就清理掉
function s60LineUpEtimer() {
    document.getElementById("Iccstate").innerHTML = "离线";
    clearInterval(IcclineUpargstate);
    clearInterval(IccSeat);
    document.getElementById("btnSend").style.display = "none";
}

function setStateLine(state, lineup) {
    document.getElementById("Iccstate").innerHTML = state;
    document.getElementById("IcclineUp").innerHTML = lineup;
}

function SendSocket() {
    var str = document.getElementById("txtwsDoc").value;
    if (str != "") {
        wsk.SendSocketStr(str);
    }
    else {
        document.getElementById("showstate").innerText = "命令不可为空";
    }
}

/*2019-09-18 增加对应的外拨列表调用方法*/
function Suredial(tel, entel, IsAlert) {
    if (confirm('确认要拨打 ' + entel + ' 电话吗?') == true) {
        IccPhone.options.isCalloutAlert = IsAlert;
        wsk.makeCall(tel, '');
    }
}

//坐席监控页面调用的强插方法
function seatthreetalk(tel) {
    wsk.ThreeTalk(tel);
}

//坐席监控页面调用的强拆方法
function seatkilltalk(tel) {
    wsk.KillTalk(tel);
}

//坐席监控页面调用监听操作
function seatmonitortalk(tel) {
    wsk.MonitorTalk(tel)
}

//班长后台签入
function seatAdminCheckIn(para) {
    wsk.AdminCheckIn(para)
}
