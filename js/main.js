var varNum = 2;
var MAX_VAR_NUM = 6;
var MIN_VAR_NUM = 2;

window.onload = function () {
    genTable();

    $("#btn_plus").click(function () {
        if (varNum < MAX_VAR_NUM) {
            varNum++;
            genTable();
        }
    });

    $("#btn_minus").click(function () {
        if (varNum > MIN_VAR_NUM) {
            varNum--;
            genTable();
        }
    });
    
    $("#btn_ddnf").click(function () {
        calcDdnf($("#latexMode").checked);
    });
    
    $("#btn_ddnf").click(function () {
        calcDknf($("#latexMode").checked);
    });
};

function genTable() {
    // Gen head
    $("#label_num").text(varNum);
    var head = $("#truth_table_head");
    head.empty();
    for (i = 1; i <= varNum; i++) {
        head.append("<td><div class=\"text-center text-primary\">X<sub>" + i + "</sub></div></td>");
    }
    head.append("<td class=\"col-lg-2\"><div class=\"text-center text-warning\">F<sub>" + 1 + "</sub></div></td>");

    // Gen body
    var body = $("#truth_table_body");
    body.empty();
    var rows = Math.pow(2, varNum);
    for (i = 0; i < rows; i++) {
        var row = $("<tr></tr>");
        for (j = 1; j <= varNum; j++) {
            var n = Math.pow(2, varNum - j);
            var m = Math.floor(i / n);
            row.append("<td>" + (m % 2 === 0 ? "0" : "1") + "</td>");
        }
        row.append("<td><div class=\"col-lg-9\"><div class=\"input-group\">"
                + "<span class=\"input-group-addon\"><input type=\"checkbox\" onclick=\"clickCheckbox(this, " + i + ")\"></span>"
                + "<input type=\"text\" id=\"f" + i + "\" class=\"form-control\" disabled value=\"0\"></div></td>");
        body.append(row);
    }
}

function clickCheckbox(chBox, id) {
    var input = $("#f" + id);
    if (chBox.checked)
        input.val("1");
    else
        input.val("0");
}

function getTableContent() {
    var result = [];
    var body = $("#truth_table_body");
    body.children().each(function (idx, val) {
        result[idx] = val;
    });
    return result;
}

function calcDdnf(latexMode) {
    var data = getTableContent();
    var text = $("#result_text").empty();
    text.append(data.toString());
    console.log("Data: " + data.toString());
}

function calcDknf(latexMode) {
    
}

