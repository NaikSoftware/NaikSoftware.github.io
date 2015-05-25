$(function () {
	
	/////////////////////
	// Initialization
	/////////////////////
	
    var MAX_VAR_NUM = 6;
    var MIN_VAR_NUM = 2;
	var varNum = MIN_VAR_NUM;
	
	var MAX_FUNC_NUM = 5;
    var MIN_FUNC_NUM = 1;
	var funcNum = 1;
	
	var labelVarNums = $('#label_num');
	var labelFuncNums = $('#label_num_f');
	var resultText = $('#result_text');

    genTable();

	////////////////////
	// Set listeners
	////////////////////
	
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
	
	$("#btn_plus_f").click(function () {
        if (funcNum < MAX_FUNC_NUM) {
            funcNum++;
            genTable();
        }
    });
	
	$("#btn_minus_f").click(function () {
        if (funcNum > MIN_FUNC_NUM) {
            funcNum--;
            genTable();
        }
    });

    $("#btn_ddnf").click(function () {
        calcFull("ddnf", $("#latexMode").get(0).checked);
    });

    $("#btn_dknf").click(function () {
        calcFull("dknf", $("#latexMode").get(0).checked);
    });
	
	$("#btn_quine_mac_klask").click(function () {
        calcQuineMacKlask($("#latexMode").get(0).checked);
    });
	
	////////////////////
	// Functions
	////////////////////
	
function genTable() {
    // Gen head
    labelVarNums.text(varNum);
	labelFuncNums.text(funcNum);
    var head = $("#truth_table_head").empty();
    for (var i = 1; i <= varNum; i++) {
        head.append('<td><div class="text-center text-primary">X<sub>' + i + '</sub></div></td>');
    }
	for (i = 1; i <= funcNum; i++) {
        head.append('<td class="col-lg-2"><div class="text-center text-warning">F<sub>' + i + '</sub></div></td>');
	}

    // Gen body
    var body = $("#truth_table_body").empty();
    var rows = Math.pow(2, varNum);
    for (var i = 0; i < rows; i++) {
        var row = $("<tr>");
        for (var j = 1; j <= varNum; j++) {
            var n = Math.pow(2, varNum - j);
            var m = Math.floor(i / n);
            row.append("<td>" + (m % 2 === 0 ? "0" : "1") + "</td>");
        }
		for (j = 1; j <= funcNum; j++) {
            row.append('<td style="width: 100px"><div class="input-group">'
                    + '<span class="input-group-addon"><input type="checkbox" onclick="clickCheckbox(this, \'row' + i + 'f' + j + '\')"></span>'
                    + '<input type="text" id="row' + i + 'f' + j + '" class="form-control" disabled value="0" style="min-width: 40px"></div></td>');
            body.append(row);
		}
    }
}

function getTableContent() {
    var vars = [];
    var funcs = [];
    var body = $("#truth_table_body");
    body.children().each(function (idx, valTr) {
        var row = [];
		var func = [];
        $(valTr).children().each(function (idx2, valTd) {
            if (idx2 < varNum) {
                row[idx2] = Number(valTd.innerText);
            } else {
                func[idx2 - varNum] = Number($(valTd).find("input[type=text]").val());
            }
        });
        vars[idx] = row;
		funcs[idx] = func;
    });
    return {varTable: vars, funcTable: funcs};
}

// Розрахунок ДДНФ або ДКНФ
function calcFull(modeName, latex) {
    var mode = 0;
    if (modeName === 'ddnf')
        mode = 1;
    var data = getTableContent();
    resultText.empty();
    resultText.append((mode === 1 ? 'ДДНФ' : 'ДКНФ') + '(F<sub>1</sub>) = ');
	var vars = data.varTable;
	var funcs = data.funcTable;
    var rows = vars.length;
    var implicants = 0;
    for (var i = 0; i < rows; i++) {
        if (funcs[i][0] === mode) {
            var impl = '';
            if (mode === 1) {
                if (implicants++ > 0 ? ' + ' : '') {
                    impl += '+';
                }
            } else {
                implicants = 0;
                impl += '(';
            }
            impl += '<i>';
            for (var j = 0; j < varNum; j++) {
                if (mode === 0 && implicants++ > 0) {
                    impl += '+';
                }
                if (vars[i][j] === mode) {
                    impl += ('x<sub>' + (j + 1) + '</sub>');
                } else {
                    impl += ('<span class="overline">x</span><sub>' + (j + 1) + '</sub>');
                }
            }
            impl += '</i>';
            if (mode === 0)
                impl += ')';
            resultText.append(impl);
        }
    }
}

function calcQuineMacKlask(latexMode) {
	resultText.empty();
	resultText.append('Метод Квайна - Мак-Класка');
	var data = getTableContent();
	var vars = data.varTable;
	var funcs = data.funcTable;
	var tableGroups = $('<table>').addClass('table stripped');
	var groups = [];
	for (var i = 0; i <= varNum; i++) {
		var group = [];
		for (var j = 0; j < vars.length; j++) {
			var count = 0;
			var impl = '';
			var haveFuncOnImpl = false;
			for (var k = 0; k < funcNum; k++) {
				if (funcs[j][k] === 1) {
					haveFuncOnImpl = true;
					break;
				}
			}
			if (haveFuncOnImpl) {
			    for (k = 0; k < varNum; k++) {
				    impl += vars[j][k];
				    if (vars[j][k] === 1) {
					    count++;
				    }
			    }
			    if (count === i) {
					group[group.length] = impl;
				}
			}
		}
		groups[i] = group;
	}
	var content = '';
	for (i = 0; i < groups.length; i++) {
		var group = groups[i];
		for (j = 0; j < group.length; j++) {
			content += '<tr><td>' + i + '</td><td>' + group[j] + '</td></tr>\n';
		}
	}
	tableGroups.append(content);
	resultText.append($('<div>').addClass('panel panel-default').append(tableGroups));
}

});

function clickCheckbox(chBox, id) {
    var input = $('#' + id);
    if (chBox.checked)
        input.val('1');
    else
        input.val('0');
}

