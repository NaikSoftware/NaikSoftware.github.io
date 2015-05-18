var varNum = 2;
var MAX_VAR_NUM = 6;
var MIN_VAR_NUM = 2;

$(function () {
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
        calcFull("ddnf", $("#latexMode").get(0).checked);
    });
    
    $("#btn_dknf").click(function () {
        calcFull("dknf", $("#latexMode").get(0).checked);
    });
});

function genTable() {
    // Gen head
    $("#label_num").text(varNum);
    var head = $("#truth_table_head").empty();
    for (i = 1; i <= varNum; i++) {
        head.append("<td><div class=\"text-center text-primary\">X<sub>" + i + "</sub></div></td>");
    }
    head.append("<td class=\"col-lg-2\"><div class=\"text-center text-warning\">F<sub>" + 1 + "</sub></div></td>");

    // Gen body
    var body = $("#truth_table_body").empty();
    var rows = Math.pow(2, varNum);
    for (i = 0; i < rows; i++) {
        var row = $("<tr>");
        for (j = 1; j <= varNum; j++) {
            var n = Math.pow(2, varNum - j);
            var m = Math.floor(i / n);
            row.append("<td>" + (m % 2 === 0 ? "0" : "1") + "</td>");
        }
        row.append('<td class="col-lg-9"><div class="input-group">'
                + '<span class="input-group-addon"><input type="checkbox" onclick="clickCheckbox(this, ' + i + ')"></span>'
                + '<input type="text" id="f' + i + '" class="form-control" disabled value="0"></div></td>');
        body.append(row);
    }
}

function clickCheckbox(chBox, id) {
    var input = $('#f' + id);
    if (chBox.checked)
        input.val('1');
    else
        input.val('0');
}

function getTableContent() {
    var result = [];
	var func = [];
    var body = $("#truth_table_body");
    body.children().each(function (idx, valTr) {
		var row = [];
        $(valTr).children().each(function (idx2, valTd) {
			if (valTd.innerText !== '') {
				row[idx2] = valTd.innerText;
			} else {
				func[idx] = $(valTd).find("input[type=text]").val();
			}
		});
		result[idx] = row;
    });
    return {tbl: result, fnc: func};
}

function calcFull(modeName, latex) {
	var mode = '0';
	if (modeName === 'ddnf') mode = '1';
    var data = getTableContent();
    var text = $('#result_text').empty();
	text.append((mode === '1' ? 'ДДНФ' : 'ДКНФ') + '(F<sub>1</sub>) = ');
	var rows = data.fnc.length;
	var implicants = 0;
	for (var i = 0;i < rows;i++) {
		if (data.fnc[i] === mode) {
			var impl = '';
			if (mode === '1') {
				if (implicants++ > 0? ' + ' : '') {
				    impl += '+';
				}
			} else {
				implicants = 0;
				impl += '(';
			}
			impl += '<i>';
			for (var j = 0;j < varNum;j++) {
				if (mode === '0' && implicants++ > 0) {
					impl += '+';
				}
				if (data.tbl[i][j] === mode) {
					impl += ('x<sub>' + (j + 1) + '</sub>');
				} else {
					impl += ('<span class="overline">x</span><sub>' + (j + 1) + '</sub>');
				}
			}
			impl += '</i>';
			if (mode === '0') impl += ')';
			text.append(impl);
		}
	}
}

