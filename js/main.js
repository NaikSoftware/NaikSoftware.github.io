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

    //console.log('Result \n' + JSON.stringify(absorbImplicates({vars:"00",labels:"0",absorbed:false}, {vars:"01",labels:"0",absorbed:false})));

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
        printFull("ddnf", $("#latexMode").get(0).checked);
    });

    $("#btn_dknf").click(function () {
        printFull("dknf", $("#latexMode").get(0).checked);
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
        for (var i = 0; i < varNum; i++) {
            head.append('<td><div class="text-center text-primary">X<sub>' + i + '</sub></div></td>');
        }
        for (i = 0; i < funcNum; i++) {
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
    function printFull(modeName, latex) {
        var mode = 0;
        if (modeName === 'ddnf')
            mode = 1;
        var data = getTableContent();
        resultText.empty();

        var vars = data.varTable;
        var funcs = data.funcTable;
        var rows = vars.length;
        var implicants;
        for (var f = 0; f < funcs[0].length; f++) {
            resultText.append((mode === 1 ? 'ДДНФ' : 'ДКНФ') + '(F<sub>' + f + '</sub>) = ');
            implicants = 0;
            for (var i = 0; i < rows; i++) {
                if (funcs[i][f] === mode) {
                    var impl = '';
                    if (mode === 1) {
                        if (implicants++ > 0) {
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
                            impl += ('x<sub>' + j + '</sub>');
                        } else {
                            impl += ('<span class="overline">x</span><sub>' + j + '</sub>');
                        }
                    }
                    impl += '</i>';
                    if (mode === 0)
                        impl += ')';
                    resultText.append(impl);
                }
            }
            resultText.append('<hr>');
        }
    }

    function calcQuineMacKlask(latexMode) {
        resultText.empty();
        resultText.append('<strong>Метод Квайна - Мак-Класка</strong><br/>');
        var data = getTableContent();
        var tableGroups;
        var groups = getGroupsStructure(data.varTable, data.funcTable);
        var ddnf = groups;

        var skdnf = [];
        var absorbNeeded = true;
        var step = 0;
        while (absorbNeeded) {
            console.log('/////////////////////// NEXT ITER');
            console.log(JSON.stringify(groups));
            absorbNeeded = false;
            var k, m;
            var group1, group2;
            var resImpl, res;
            var newGroups = [];
            var newGroup;
            for (i = 0; i < groups.length; i++) {
                group1 = groups[i];
                console.log('///////// NEXT GROUP');
                console.log(JSON.stringify(group1));
                newGroup = [];
                for (j = 0; j < group1.length; j++) {
                    for (k = i + 1; k < groups.length; k++) { // Обход по группам что ниже
                        group2 = groups[k];
                        for (m = 0; m < group2.length; m++) {
                            console.log('Gr=' + i + ' Im=' + j + ' >>>  Gr=' + k + ' Im=' + m);
                            resImpl = absorb(group1[j], group2[m]);
                            console.log('absorb result: ' + JSON.stringify(resImpl));
                            if (!resImpl)
                                continue;
                            absorbNeeded = true;
                            res = absorbImplicates(group1[j], group2[m]);
                            console.log('absorbImplaicates result: ' + JSON.stringify(res));
                            newGroup[newGroup.length] = {vars: resImpl, labels: res.new_labels, absorbed: false};
                            group1[j].absorbed = res.absorbed_1;
                            group2[m].absorbed = res.absorbed_2;
                        }
                    }
                }
                newGroups[i] = newGroup;
            }
            resultText.append('Крок ' + ++step);
            tableGroups = $('<table>').addClass('table table-bordered');
            tableGroups.append($('<thead>').append('<tr>\n\
                        <td>Номер групи</td>\n\
                        <td>Імпліканта</td>\n\
                        <td>Мітки</td>\n\
                        <td>Поглинена</td>\n\
                     </tr>'));
            generateTableContent(tableGroups, groups);
            resultText.append($('<div>').addClass('panel panel-default').append(tableGroups));
            newGroups = removeDuplicateImpl(newGroups);
            addNotAbsorbed(groups, skdnf);
            groups = newGroups;
        }
        resultText.append('СкДНФ = ' + implicatesToStr(skdnf));
        buildImplTable(skdnf, ddnf);
    }

    function getGroupsStructure(vars, funcs) {
        var groups = [];
        for (var i = 0; i <= varNum; i++) {
            var group = [];
            for (var j = 0; j < vars.length; j++) {
                var count = 0;
                var impl = '';
                var labels = '';
                var haveFuncOnImpl = false;
                for (var k = 0; k < funcNum; k++) {
                    if (funcs[j][k] === 1) {
                        haveFuncOnImpl = true;
                        labels += k;
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
                        group[group.length] = {vars: impl, labels: labels, absorbed: false};
                    }
                }
            }
            groups[i] = group;
        }
        return groups;
    }

    function generateTableContent(table, groups) {
        var content = '';
        for (var i = 0; i < groups.length; i++) {
            var group = groups[i];
            for (var j = 0; j < group.length; j++) {
                content += '<tr><td>' + i + '</td>'
                        + '<td>' + group[j].vars + '</td>'
                        + '<td>' + getHumanReadableLabels(group[j]) + '</td>'
                        + '<td>' + (group[j].absorbed ? 'Так' : '') + '</td></tr>\n';
            }
        }
        table.append(content);
    }

    // Absorb impl if needed
    function absorbImplicates(im1, im2) {
        console.log('absorbImplicates started: ' + JSON.stringify(im1) + ' and ' + JSON.stringify(im2));
        var newLabels = '';
        var absorbed1 = im1.absorbed;
        var absorbed2 = im2.absorbed;
        var eq = 0;
        for (var i = 0; i < im1.labels.length; i++) {
            if (im2.labels.indexOf(im1.labels[i]) !== -1) {
                newLabels += im1.labels[i];
                eq++;
            }
        }
        if (eq === im1.labels.length) {// всі мітки першої є в другій
            absorbed1 = true;
        }
        eq = 0;
        for (var i = 0; i < im2.labels.length; i++) {
            if (im1.labels.indexOf(im2.labels[i]) !== -1)
                eq++;
        }
        if (eq === im2.labels.length) {
            absorbed2 = true;
        }
        return {absorbed_1: absorbed1, absorbed_2: absorbed2, new_labels: newLabels};
    }

    // Absorb vars
    function absorb(a, b) {
        console.log('absorb started: ' + JSON.stringify(a) + ' and ' + JSON.stringify(b));
        if (!varsComparable(a, b) || !labelsComparable(a, b))
            return false;
        var vars = '';
        var diff = 0;
        for (var i = 0; i < a.vars.length; i++) {
            if (a.vars[i] !== b.vars[i]) {
                diff++;
                vars += '_';
            } else {
                vars += a.vars[i];
            }
        }
        if (diff > 1)
            return false;
        return vars;
    }

    function varsComparable(a, b) {
        for (var i = 0; i < a.vars.length; i++) {
            if ((a.vars[i] !== b.vars[i])
                    && (b.vars[i] === '_' || a.vars[i] === '_'))
                return false;
        }
        return true;
    }

    function labelsComparable(a, b) {
        for (var i = 0; i < a.labels.length; i++) {
            if (b.labels.indexOf(a.labels[i]) !== -1)
                return true;
        }
        return false;
    }

    function removeDuplicateImpl(groups) {
        var newGroups = [];
        var newGroup;
        var group;
        var skip;
        for (var i = 0; i < groups.length; i++) {
            group = groups[i];
            newGroup = [];
            for (var j = 0; j < group.length; j++) {
                skip = false;
                for (var k = j + 1; k < group.length; k++) {
                    if (group[j].vars === group[k].vars
                            && group[j].labels === group[k].labels) {
                        skip = true;
                        console.log('SKIP ' + JSON.stringify(group[j]) + ' === ' + JSON.stringify(group[k]));
                        console.log('in group ' + i + ' indexes: ' + j + ' === ' + k);
                        break;
                    }
                }
                if (!skip) {
                    newGroup[newGroup.length] = group[j];
                }
            }
            newGroups[i] = newGroup;
        }
        return newGroups;
    }

    function addNotAbsorbed(groups, skdnfImpl) {
        var group;
        for (var i = 0; i < groups.length; i++) {
            group = groups[i];
            for (var j = 0; j < group.length; j++) {
                if (!group[j].absorbed) {
                    skdnfImpl[skdnfImpl.length] = group[j];
                }
            }
        }
    }

    function implicatesToStr(impl) {
        var str = '';
        for (var i = 0; i < impl.length; i++) {
            str += impl[i].vars + '(' + getHumanReadableLabels(impl[i]) + ')';
            if (i < impl.length - 1)
                str += ' + ';
        }
        return str;
    }

    function buildImplTable(skdnf, ddnfGroups) {
        // Разбиваем по функциям
        var ddnf = [];
        var impl;
        var funcGroup;
        for (var i = 0; i < ddnfGroups.length; i++) {
            for (var j = 0; j < ddnfGroups[i].length; j++) {
                impl = ddnfGroups[i][j];
                for (var k = 0; k < impl.labels.length; k++) {
                    funcGroup = ddnf[impl.labels[k]];
                    if (funcGroup === undefined)
                        funcGroup = [];
                    funcGroup[funcGroup.length] = impl;
                    ddnf[impl.labels[k]] = funcGroup;
                }
            }
        }
        console.log("DDNF split to functions:");
        console.log(JSON.stringify(ddnf, null, 4));
        resultText.append('<hr>Імплікантна таблиця<br/>');
        var table = $('<table>').addClass('table table-bordered modal-body').attr('id', 'impl_table');
        // Generate table head
        var ddnfRow = $('<tr>').append('<td style="min-width: 100px;">ДДНФ<br/>СкДНФ</td>');
        var funcRow = $('<tr>').append($('<td>Func</td>'));
        for (var i = 0; i < ddnf.length; i++) {
            funcRow.append('<td class="text-center" colspan="' + ddnf[i].length + '">' + i + '</td>');
        }
        for (var i = 0; i < ddnf.length; i++) { // Обход по групам функций
            for (var j = 0; j < ddnf[i].length; j++) {
                impl = ddnf[i][j];
                ddnfRow.append($('<td>').append(impl.vars).addClass('text-center'));
            }
        }
        table.append($('<thead>').append(funcRow, ddnfRow));
        // Generate table body
        var row;
        var skImpl;
        for (var i = 0; i < skdnf.length; i++) {
            skImpl = skdnf[i];
            row = $('<tr>').append($('<td nowrap>').append(skImpl.vars
                    + '<span class="pull-right">(' + getHumanReadableLabels(skImpl) + ')</span>'));
            for (var j = 0; j < ddnf.length; j++) { // Номер функции
                for (var k = 0; k < ddnf[j].length; k++) {// Номер импликанты
                    impl = ddnf[j][k];
                    if (labelsComparable(skImpl, {labels: String(j)}) && implAinB(skImpl, impl)) {
                        row.append($('<td>').append('<i class="glyphicon glyphicon-ok"></i>').addClass('text-center'));
                    } else {
                        row.append($('<td>').addClass('text-center'));
                    }
                }
            }
            table.append(row);
        }
        resultText.append(table);
        resultText.append('<a class="btn btn-default" onclick="showImplicTable()"><span class="glyphicon glyphicon-resize-full"></span></a><br/>');
    }

    // Impl b must be without '_'
    function implAinB(a, b) {
        for (var i = 0; i < a.vars.length; i++) {
            if (a.vars[i] === '_' || a.vars[i] === b.vars[i]){} //ok
            else return false;
        }
        return true;
    }

    function getHumanReadableLabels(impl) {
        var labels = '';
        for (var i = 0; i < impl.labels.length; i++) {
            labels += impl.labels[i];
            if (i < impl.labels.length - 1)
                labels += ', ';
        }
        return labels;
    }

});

function clickCheckbox(chBox, id) {
    var input = $('#' + id);
    if (chBox.checked)
        input.val('1');
    else
        input.val('0');
}

function showImplicTable() {
	var modal = $('<div>').addClass('modal fade');
	var dialog = $('<div>').addClass('modal-dialog modal-lg').css('width', $('#impl_table').width() + 70);
	var content = $('<div>').addClass('modal-content');
	var header = $('<div>').addClass('modal-header');
	var body = $('<div>').addClass('modal-body').attr('style', 'overflow: auto;');
	var data = $('#impl_table').clone(true);
	header.append('<button type="button" class="close" data-dismiss="modal">&times;</button>'
			  + '<h4 class="modal-title">Імплікантна таблиця</h4>');
	modal.append(dialog.append(content.append(header, body.append(data))));
	modal.modal('show');
}



