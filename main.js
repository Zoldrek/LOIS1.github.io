//////////////////////////////////////////////////////////////////////////////////////
// Лабораторная работа 1 по дисциплине ЛОИС
// Выполнена студентом группы 721702 БГУИР Баскаковым Максимом Александровичем
// 08.04.2020
//
// Использованные материалы:
// https://www.w3schools.com/js/ 
// http://learn.javascript.ru/
// https://stackoverflow.com/
var conjNum = 0;
var tests = ["((A&B)|(C&D))", "((A|B)&(C|D))", "(A&B)", "(A&(B&(!A)))", "(E|(D&(A|C)))", "Тест окончен"];
var testNumber = 0;
var score = 0;
function main(){
    var formula = document.getElementById("formula").value.toString();
    var exception = /^\([A-Z]\|[A-Z]\)$/;
    if (exception.test(formula)) {
        output(exception.test(formula));
    }
    else
    if (formula.includes( "&") && formula.includes( "(") && formula.includes( ")") && checkBracketsNum(formula)) {
        output(checkBinaryFormula(formula));
    } 
    else if (formula.includes( "!") && formula.includes( "(") && formula.includes( ")")) {
        output(checkUnaryFormula(formula));
    }
    else {
        output(checkSymbols(formula));
    }
    conjNum = 0;
}

function output (result){
    if (result) {
        document.getElementById("result").innerHTML = "Формула является КНФ";
    } else {
        document.getElementById("result").innerHTML = "Формула не является КНФ";
    }
}

function checkSymbols(formula) {
    var symbols = /^[A-Z]$/;
    return symbols.test(formula);
}

function checkBracketsNum(formula) {
    if (formula.includes("(") && formula.includes(")")) {
        var leftBracketsArr = formula.match(/\(/g);
        var rightBracketsArr = formula.match(/\)/g);
        if (leftBracketsArr.length !== rightBracketsArr.length) {
            return false;
        }
    } else if (formula.includes("(") && !formula.includes(")")) {
        return false;
    } else if (formula.includes(")") && !formula.includes("(")) {
        return false;
    }
    return true;
}

function removeOuterBrackets(formula) {
    formula = formula.replace(/^\(/, "");
    formula = formula.replace(/\)$/, "");
    return formula
}

function checkUnaryFormula(formula) {
    if (formula.indexOf("(") === 0) {
        formula = removeOuterBrackets(formula);
    }
    var rightSymbols = formula.match(/[A-Z01]/g);
    if (rightSymbols === null || rightSymbols.length !== 1) {
        return false;
    }
    var symbols = formula.match(/./g);
    if (symbols !== null) {
        if (rightSymbols.length !== (symbols.length-1)) {
            return false;
        }
    } else {
        return false;
    }
    return true;
}

function checkBinaryFormula(formula) {
    var result = false;

    if (formula.indexOf("(") === 0) {
        formula = removeOuterBrackets(formula);
        var symbol = "&";
        if (conjNum > 0) {
            var disjIndex = getCentralOperationIndex(formula, "|");
            if (disjIndex < formula.length) {
                symbol = "|";
            }
        }
        var operatorIndex = getCentralOperationIndex(formula, symbol);
        if (operatorIndex >= formula.length) {
            return false;
        }
        if (symbol === "&"){
            conjNum++;
        }
        var formulaElements = [];
        formulaElements[0] = formula.slice(0, operatorIndex);
        formulaElements[1] = formula.slice(operatorIndex + 1, formula.length);
        for (var i = 0; i < formulaElements.length; i++) {
            if (checkSymbols(formulaElements[i])) {
                result = true;
            } else if (checkUnaryFormula(formulaElements[i])) {
                result = true;
            } else if (checkBinaryFormula(formulaElements[i])) {
                result = true;
            } else {
                result = false;
                break;
            }
        }
    }
    return result;
}

function getCentralOperationIndex(formula, operator) {
    var openBracketsNum = 0;
    var i = 0;
    if (formula.includes("(") && formula.includes(")")) {
        while (i < formula.length) {
            if (formula[i] === "(") {
                openBracketsNum++;
            } else if (formula[i] === ")") {
                openBracketsNum--;
            } else if (formula[i] === operator && openBracketsNum === 0) {
                break;
            }
            i++;
        }
    } else if (formula.includes(operator)) {
        return formula.indexOf(operator);
    }
    return i;
}

function test(){
    if (testNumber<tests.length-1){
        main();
        var choice;
        var inp = document.getElementsByName('radio');
        for (var j = 0; j < inp.length; j++) {
            if (inp[j].type == "radio" && inp[j].checked) {
                choice =  inp[j].value;
            }
        }
        if ((document.getElementById("result").innerHTML === "Формула является КНФ" && choice === "true") || (document.getElementById("result").innerHTML === "Формула не является КНФ" && choice ==="false")){
            score++;
        }
        testNumber++;
        document.getElementById("formula").value = tests[testNumber];
        if (testNumber===tests.length-1){
            document.getElementById("score").innerHTML ="Правильных ответов - "+score+" из 5";
        }
    }
}
