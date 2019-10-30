﻿$(document).ready(function () {
    loadData();
    load_MachineID();
    load_Item();
    $('#FPBCheckingDate').datepicker();
    //$('#UserID').val($('#UserLogin').data('username'););

    $('#UserID').val($('#UserLogin').data('username'));
    $("input[name='Result']").val(["OK"]);
    debugger;
});
var checkOK = "OK";
var FPBCheckingIDLast = "";
var loginUserID = $('#UserLogin').data('id');
var loginUserName = $('#UserLogin').data('username');
$(document).ready(function () {
    $('#MachineID').change(function () {
        var machineID = $('#MachineID').val().trim();
        $.ajax({
            url: "/Machine/GetbyID/",
            data: { 'machineID': machineID },
            type: "GET",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (result) {
                $('#MachineName').val(result.MachineName);
            },
        });
        loadFPBCheckingItemName(machineID);
    });
});
function loadData() {
    $.ajax({
        url: "/FPBChecking/List",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            //loginUserID = result.UserID;
            //loginUserName = result.UserName;
            $.each(result.LstFPBChecking, function (key, item) {
                html += '<tr>';
                html += '<td>' + item.ID + '</td>';
                html += '<td>' + item.IndicationNo + '</td>';
                html += '<td>' + SM_ConvertMsJsonDate_ToString(item.FPBCheckingDate) + '</td>';
                html += '<td>' + item.ItemName + '</td>';
                html += '<td>' + item.ItemCode + '</td>';
                html += '<td>' + item.BatchNo + '</td>';
                html += '<td>' + item.MachineID + '</td>';
                html += '<td>' + item.MachineName + '</td>';
                html += '<td>' + item.UserID + '</td>';
                html += '<td>' + item.SeqNo + '</td>';
                html += '<td>' + item.BlockID + '</td>';
                html += '<td>' + item.Result + '</td>';
                html += '<td>' + item.ResultContent + '</td>';
                html += '<td><a href=\'\' target="_blank"  onclick="this.href =\'/FPBChecking/Edit?id=' + item.ID + '\'">View</a> |<a href=\'\' target="_blank"  onclick="this.href =\'/FPBChecking/Edit?id=' + item.ID + '\'">Edit</a> | <a href="#" onclick="return DeleleByID(\'' + item.ID + '\')">Delete</a></td>';
                html += '</tr>';
            });
            $('.tbody').html(html);
        },
        error: function (errormessage) {
            alert('Error' + errormessage.responseText);
        }
    });
}

function ViewbyID(ID) {
    $("#imgalign").html('');
    $.ajax({
        url: "/FPBChecking/GetbyID/",
        data: { 'ID': ID },
        type: "GET",
        cache: false,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('.IndicationNo').text(result.LstFPBChecking[0].IndicationNo);
            $('.FPBCheckingDate').text(SM_ConvertMsJsonDate_ToString(result.LstFPBChecking[0].FPBCheckingDate));
            $('.ItemCode').text(result.LstFPBChecking[0].ItemCode);
            $('.ItemName').text(result.LstFPBChecking[0].ItemName);
            $('.BatchNo').text(result.LstFPBChecking[0].BatchNo);
            $('.MachineID').text(result.LstFPBChecking[0].MachineID);
            $('.MachineName').text(result.LstFPBChecking[0].MachineName);
            $('.SeqNo').text(result.LstFPBChecking[0].SeqNo);
            $('.BlockID').text(result.LstFPBChecking[0].BlockID);
            $('.UserID').text(result.LstFPBChecking[0].UserID);
            $(".Result").text(result.LstFPBChecking[0].Result);
            if (result.LstFPBChecking[0].Images != "" && result.LstFPBChecking[0].Images != null && result.LstFPBChecking[0].Images.length>0) {
                var links = JSON.parse(result.LstFPBChecking[0].Images);
                var extention = links[0].split(".")[1];
                if (extention == "jpg" || extention == "png" || extention == "jpeg") {
                    var img = links[0].replace('~', "..");
                    $("#imgalign").html('<img height="200" width="300" src="' + img + '" />');
                } else {
                    if (links.length == 1) {
                        var img = links[0].replace('~', "..");
                        var name = links[0].split('/');
                        console.log(name);
                        $("#imgalign").html('<a href="' + img + '" download>' + name[name.length - 1] + '<a/>');
                    } else {
                        for (i = 0; i < links; i++) {
                            var link = links[i].replace('~', "..");
                            var name = links[i].split('/');
                            $("#imgalign").append('<a href="' + link + '" download>' + name[name.length - 1] + '<a/>');
                        }
                    }
                }
            }
            //$("#IMG").attr('src', JSON.parse(result.LstFPBChecking[0].Images)[0]);
            $('#myView').modal('show');
        },
        error: function (errormessage) {
            alert('Error    ' + errormessage.responseText);
        }
    });
    return false;
}
function loadFPBCheckingItemName(machineID) {
    $.ajax({
        url: "/FPBCheckingItem/GetFPBCheckingItemName",
        type: "GET",
        data: { 'machineID': machineID },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            loginUserID = result.UserID;
            loginUserName = result.UserName;
            $('#UserID').val(loginUserName); //???????
            $.each(result.LstFPBCheckingItem, function (key, item) {
                html += '<tr>';
                html += '<td>' + item.CheckingItemName + '</td>';
                html += '<td style="display:none"><input type="text" disabled = "true" value= "' + item.IDFPBCheckingItem + '"></input></td>';
                if (item.FrequencyID == 1) {
                    html += '<td><input type="checkbox"  name="OK" id="firstOK' + item.IDFPBCheckingItem + '" AutoPostBack = "true" onchange="check_CheckedChangedFirstOK(\'' + item.IDFPBCheckingItem + '\')" >OK</input>  |  <input type="checkbox" name="NG" id="firstNG' + item.IDFPBCheckingItem + '" AutoPostBack="true" onchange ="check_CheckedChangedFirstNG(\'' + item.IDFPBCheckingItem + '\')" >NG</input></td>';
                }
                else html += '<td></td>';
                if (item.FrequencyID == 2) {
                    html += '<td><input type="checkbox" name="OK" id="middleOK' + item.IDFPBCheckingItem + '" AutoPostBack = "true" onchange="check_CheckedChangedMiddleOK(\'' + item.IDFPBCheckingItem + '\')" >OK</input>  |  <input type="checkbox" name="NG" id="middleNG' + item.IDFPBCheckingItem + '" AutoPostBack="true" onchange ="check_CheckedChangedMiddleNG(\'' + item.IDFPBCheckingItem + '\')" >NG</input></td>';
                }
                else html += '<td></td>';
                if (item.FrequencyID == 3) {
                    html += '<td><input type="checkbox"  name="OK" id="endOK' + item.IDFPBCheckingItem + '" AutoPostBack = "true" onchange="check_CheckedChangedEndOK(\'' + item.IDFPBCheckingItem + '\')" >OK</input>  |  <input type="checkbox" name="NG" id="endNG' + item.IDFPBCheckingItem + '" AutoPostBack="true" onchange ="check_CheckedChangedEndNG(\'' + item.IDFPBCheckingItem + '\')" >NG</input></td>';
                }
                else html += '<td></td>';
                html += '</tr>';
            });
            $('.tbody').html(html);
        },
        error: function (errormessage) {
            alert('Error' + errormessage.responseText);
        }
    });
}

function clearTextBox() {
    //$('#ID').val("");
    $('#FPBCheckingDate').val("");
    $('#SearchFPBCheckingDate').val("");
    $('#SearchMachineID').val("");
    $('#IndicationNo').css('border-color', 'lightgrey');
    $('#UserID').val($('#UserLogin').data('username'));
    $('#SeqNo').css('border-color', 'lightgrey');
    $('#MachineID').css('border-color', 'lightgrey');
    $('#ItemName').css('border-color', 'lightgrey');
    $('#ItemCode').css('border-color', 'lightgrey');
    $('#BatchNo').css('border-color', 'lightgrey');
    $('#MachineName').css('border-color', 'lightgrey');
    $('#btnUpdate').hide();
    $('#btnAdd').show();
    $('#myModalLabel').text("Add New FPB Checking");
}
function validate() {
    var isValid = true;
    if ($('#FPBCheckingDate').val().trim() == "") {
        $('#FPBCheckingDate').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#FPBCheckingDate').css('border-color', 'lightgrey');
    }
    if ($('#IndicationNo').val().trim() == "") {
        $('#IndicationNo').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#IndicationNo').css('border-color', 'lightgrey');
    }
    if ($('#UserID').val().trim() == "") {
        $('#UserID').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#UserID').css('border-color', 'lightgrey');
    }
    //if ($('#SeqNo').val().trim() == "") {
    //    $('#SeqNo').css('border-color', 'Red');
    //    isValid = false;
    //}
    //else {
    //    $('#SeqNo').css('border-color', 'lightgrey');
    //}
    if ($('#MachineID').val().trim() == "") {
        $('#MachineID').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#MachineID').css('border-color', 'lightgrey');
    }
    if ($('#MachineName').val().trim() == "") {
        $('#MachineName').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#MachineName').css('border-color', 'lightgrey');
    }
    if ($('#ItemName').val().trim() == "") {
        $('#ItemName').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#ItemName').css('border-color', 'lightgrey');
    }
    if ($('#ItemCode').val().trim() == "") {
        $('#ItemCode').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#ItemCode').css('border-color', 'lightgrey');
    }
    if ($('#BatchNo').val().trim() == "") {
        $('#BatchNo').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#BatchNo').css('border-color', 'lightgrey');
    }
    //debugger;
    //var result_data = $("input[name='rdo_Result']:checked").val();
    //if (result_data == null || result_data == "" || result_data == 'undefined') {
    //    alert('Hãy chọn kết quả kiểm tra/Please,choose Result! ');
    //    isValid = false;
    //}
    //else {
    //    $('#Result').css('border-color', 'lightgrey');
    //}
    return isValid;
}
// **** Event ***************************************************** 
//$("#Images").change(function (e) {
   
//    var myfiles = document.getElementById("Images").files;
//    var viewImages = document.getElementById("viewImages");
   
//    var quan = document.getElementById("Images").value;
//    var imageType = /image.*/;
//    console.log(quan);
//    var html = '';
//    if (myfiles.length > 0) {
//        for (i = 0; i < myfiles.length; i++) {

            
        
//            if (myfiles[i].type.match(imageType)) {   //image file.
              
//                var temp = 0;
//                var reader = new FileReader();
//                reader.onload = function (event) {
//                    temp++;

//                    html += '<div class="ImageContainer" style="position:relative;text-align:center;">';
//                    html += '<div style="position:absolute;top:8px;right:16px;font-size:18px">';
//                    html += '<a href="#" onclick="removeIndexImage(' + temp + ')" class="btn btn-primary"><img style="width:25px;height:19px;" src="/Images/Common/upload-tool-delete.png"/></a>';
//                    html += '</div>';
//                    html += '<a href="' + event.target.result + '">';
//                    html += '<img src="' + event.target.result + '" style="width:100%"/>';
//                    html += '</a>';
//                    //html += '</div>';
//                    html += '</div>';
//                }

//                reader.readAsDataURL(myfiles[i]);
//            }
//            else {
//                var extention = myfiles[i].name.substring(myfiles[i].name.lastIndexOf(".") + 1).toLowerCase();
//                if (extention == "pdf")
//                {
//                    var tagLabel = document.createElement("lable");
//                    tagLabel.innerHTML = myfiles[i].name;
//                    tagLabel.style.fontWeight = "bold";
//                    //viewImages.appendChild(divContainer);
//                    viewImages.appendChild(tagLabel);
//                }
//            }
//        }
//        $('#viewImages').html(html);
//    }
//});


$("#Images").change(function (e) {



    var myfiles = document.getElementById("Images").files;
    var viewImages = document.getElementById("viewImages");

    var quan = document.getElementById("Images").value;
    var imageType = /image.*/;
    console.log(quan);
    var html = '';
    if (myfiles.length > 0) {
        for (i = 0; i < myfiles.length; i++) {




          
            //var divuploadimagetools = document.createElement("div");
            //divuploadimagetools.className = "upload-image-tools";
            //divuploadimagetools.innerHTML = '<span class="upload-tool-delete"></span>';
            //divuploadimagetools.className = "upload-image-tools";

            if (myfiles[i].type.match(imageType)) {   //image file.

                var temp = 0;
                var reader = new FileReader();
                reader.onload = function (event) {
                  
                    temp++;
                  
                    var tagA = document.createElement("a");
                    tagA.href = event.target.result;
                    var image = new Image();

                    image.src = event.target.result;
                    //add new
                    image.className = "listImage"
                    image.height = 345;
                    image.width = 520;
                    image.id = temp;
                    tagA.appendChild(image);
                    //divContainer.appendChild(tagA);
                     
                    var divContainer = document.createElement("div");
                    divContainer.className = "DivImage";
                    divContainer.innerHTML += '<div id="myList" class="ImageContainer" style="position:relative;text-align:center;">'
                           + '<div style="position:absolute;top:8px;right:16px;font-size:18px">'
                           + '<a href="#" id="deleteimg" onclick="removeIndexImage(' + temp + ')" class="btn btn-primary"><img style="width:25px;height:19px;" src="/Images/Common/upload-tool-delete.png"/></a>';
                    divContainer.appendChild(tagA);
                    viewImages.appendChild(divContainer);
                }

                reader.readAsDataURL(myfiles[i]);
            }
            else {
                var extention = myfiles[i].name.substring(myfiles[i].name.lastIndexOf(".") + 1).toLowerCase();
                if (extention == "pdf") {
                    var tagLabel = document.createElement("lable");
                    tagLabel.innerHTML = myfiles[i].name;
                    tagLabel.style.fontWeight = "bold";
                    //viewImages.appendChild(divContainer);
                    viewImages.appendChild(tagLabel);
                }
            }
        }
        
    }
});

$('.deleteimg').on("click", function (e) { //user click on remove text
        e.preventDefault(); $(this).parent('div').remove();
        img.val = '';
        input.value = null;
        console.log('Input value after remove: ', input.value)
    });
//count mutifile select 
$('#Images').change(function () {

    var files = $(this)[0].files;
    if (files.length > 10) {
        alert("you can select max 10 files.");
    } else {
        alert("correct, you have selected less than 10 files");
    }
});

function removeIndexImage(index) {
    console.log("Xoa vi tri Thu " + index);
    var elements = document.getElementsByClassName("DivImage");
        elements[index-1].parentNode.removeChild(elements[index-1]);
  
  //  $('#DivImage').eq(index).remove();
}
// **** Region CRUD ***************************************************** 
function InsertFPBChecking() {
    var res = validate();
    if (res == false) {
        return false;
    }
    var file = document.getElementById("Images").files;
    var FPBCheckingObj = {
        ID: 0,
        FPBCheckingDate: $('#FPBCheckingDate').val(),
        IndicationNo: $('#IndicationNo').val(),
        UserID: loginUserID,
        SeqNo: $('#SeqNo').val(),
        MachineID: $('#MachineID').val(),
        MachineName: $('#MachineName').val(),
        ItemName: $('#ItemName').val(),
        ItemCode: $('#ItemCode').val(),
        BatchNo: $('#BatchNo').val(),
        BlockID: $('#BlockID').val(),
        Result: $("input[name='Result']:checked").val(),
        BatchNo: $('#BatchNo').val(),
    };
    $.ajax({
        url: "/FPBChecking/Insert/",
        data: JSON.stringify(FPBCheckingObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var data = new FormData();
            if (file.length > 0) {
                for (var i = 0; i < file.length; i++) {
                    data.append("fileInput", file[i]);
                }
            }
            var FPBCheckingDetailObj = {
                ID: 0,
                Result: $("input[name='Result']:checked").val(),
                FPBCheckingID: result.LastID
           }
            data.append('FPBCheckingDetailObj', JSON.stringify(FPBCheckingDetailObj));
            InsertFPBCheckingDetail(data);
            $('#myModal').modal('hide');
            clearTextBox();
            alert("Thêm mới thành công/Insert success!");
            //setTimeout(function () {
            //    window.location.href = "./Index";
            //},250)
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}
function InsertFPBCheckingDetail(data) {
    $.ajax({
        url: "/FPBChecking/InsertFPBCheckingDetail/",
        data: data,
        type: "POST",
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (result) {
            $('#myModal').modal('hide');
            clearTextBox();
        },
        error: function (errormessage) {
            alert('Lỗi/Error:' + errormessage.responseText);
        }
    });

}

function UpdateFPBChecking() {
    var res = validate();
    if (res == false) {
        return false;
    }
    var file = document.getElementById("Images").files;
    var FPBCheckingObj = {
        ID: idFPBChecking,
        FPBCheckingDate: $('#FPBCheckingDate').val(),
        IndicationNo: $('#IndicationNo').val(),
        UserID: loginUserID,
        SeqNo: $('#SeqNo').val(),
        MachineID: $('#MachineID').val(),
        MachineName: $('#MachineName').val(),
        ItemName: $('#ItemName').val(),
        ItemCode: $('#ItemCode').val(),
        BatchNo: $('#BatchNo').val(),
        BlockID: $('#BlockID').val(),
        Result: $("input[name='Result']:checked").val(),
    };
    $.ajax({
        url: "/FPBChecking/Insert/",
        data: JSON.stringify(FPBCheckingObj),
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            var data = new FormData();
            if (file.length > 0) {
                for (var i = 0; i < file.length; i++) {
                    data.append("fileInput", file[i]);
                }
            }
            var FPBCheckingDetailObj = {
                Result: $("input[name='Result']:checked").val(),
                FPBCheckingID: idFPBChecking,
            }
            data.append('FPBCheckingDetailObj', JSON.stringify(FPBCheckingDetailObj));
            InsertFPBCheckingDetail(data);
            $('#myModal').modal('hide');
            alert("Update success!");

        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function load_Item() {
    $.ajax({
        url: "/ProductionList/List",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $.each(result, function (key, item) {
                html += '<option value="' + item.ItemCode + '">' + item.ItemCode + '</option>';
            });
            $('#ItemCode').html(html);
        },
        error: function (errormessage) {
            alert('Error function load_Item() :' + errormessage.responseText);
        }
    });
}
function load_MachineID() {
    $.ajax({
        url: "/Machine/List",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $.each(result, function (key, item) {
                html += '<option value="' + item.MachineID + '">' + item.MachineID + '</option>';
            });
            $('#MachineID').html(html);
        },
        error: function (errormessage) {
            alert('Error function load_LineUsing(selectObject) :' + errormessage.responseText);
        }
    });
}
function DeleleByID(id) {

    var ans = confirm("Bạn có chắc chắn muốn xóa không? /Are you sure you want to delete ?" + id);
    if (ans) {
        $.ajax({
            url: "/FPBChecking/Delete/" + id,
            
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                alert("Xóa thành công!/Deleted successful!");
                loadData();
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    }
}

function FPBChecking_Search(_pageNumber) {
    
    var s = $('#SearchFPBCheckingDate').val().split('/');
    var date = s[2] + '-' + s[0] + '-' + s[1];
    var FPBChecking = {
        MachineID: $('#SearchMachineID').val(),
        FPBCheckingDate: date,
        Result: $("input[name='SearchResult']:checked").val(),
        
    };

    var returnObj = {
        aFPBChecking: FPBChecking,
        PageNumber: _pageNumber
    }

    $.ajax({
        url: "/FPBChecking/Search",
        data: JSON.stringify(returnObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            loginUserID = result.UserID;
            loginUserName = result.UserName;
            $('#UserID').val(loginUserName);
            $.each(result.LstFPBChecking, function (key, item) {
                html += '<tr>';
                html += '<td>' + item.ID + '</td>';
                html += '<td>' + item.IndicationNo + '</td>';
                html += '<td>' + SM_ConvertMsJsonDate_ToString(item.FPBCheckingDate) + '</td>';
                html += '<td>' + item.ItemName + '</td>';
                html += '<td>' + item.ItemCode + '</td>';
                html += '<td>' + item.BatchNo + '</td>';
                html += '<td>' + item.MachineID + '</td>';
                html += '<td>' + item.MachineName + '</td>';
                html += '<td>' + item.UserID + '</td>';
                html += '<td>' + item.SeqNo + '</td>';
                html += '<td>' + item.BlockID + '</td>';
                html += '<td>' + item.Result + '</td>';
                html += '<td>' + item.ResultContent + '</td>';
                html += '<td><a href="#" onclick="return ViewbyID(\'' + item.ID + '\')">View</a> |<a href=\'\' target="_blank"  onclick="this.href =\'/FPBChecking/Edit?id=' + item.ID + '\'">Edit</a> | <a href="#" onclick="return DeleleByID(\'' + item.ID + '\')">Delete</a></td>';
                html += '</tr>';
            });
            $('.tbody').html(html);
            //Paging 
            //if (pageNumber == 1) {
            //    reloadPageTool(result.TotalPage);
            //}
        },
        error: function (errormessage) {
            alert('Error' + errormessage.responseText);
        }
    });
}




