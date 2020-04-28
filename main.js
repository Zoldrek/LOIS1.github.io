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
var testNumber = 0;
var score = 0;
var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var tests = ["((A&B)|(C&D))", "((A|B)&(C|D))", "A", "(A&B)","(A|B)",
"(A&(!A))", "(A&(B&(!A)))", "0", "1", "(0|1)", 
"(E|(D&(A|0)))", "(E|(D&(A|C)))", "(D&!(A&C))", "(A|(B|C))", "(A&(B&F))",
"(A1|B)", "(!1)", "((!A)&(!B))", "(A&(B|C))", "((A&B)&(C&D))",
"(((!T)|P)&M)", "((((!N)&I)|(!E))|L)", "((!A)&(B|C))", "((A|B)&(C&D))", "(X|((!H)|(O&H)))"];
var testResults = [false, true, true, true, true,
true, true, false, false, false,
false, false, false, true, true,
false, false, true, true, true,
true, false, true, true, false];
function main(){
    var formula = document.getElementById("formula").value.toString();
    if (checkException(formula) && checkBracketsNum(formula)) {
        output(checkException(formula));
    }
    else
    if (formula.includes( "&") && formula.includes( "(") && formula.includes( ")") && checkBracketsNum(formula)) {
        output(checkBinaryFormula(formula));
    } 
    else if (formula.includes( "!") && checkBracketsNum(formula)) {
        output(checkUnaryFormula(formula));
    }
    else {
        output(checkSymbols(formula));
    }
    conjNum = 0;
}

function checkException(formula){
    var result = false;
    var symbol;
    if (formula.includes( "|") && !formula.includes( "&")){
        symbol = "|";
    }
    else if (!formula.includes( "|") && formula.includes( "&")){
        symbol = "&";
    }
    else{
        return false;
    } 
    if (formula.indexOf("(") === 0) {
        formula = removeOuterBrackets(formula);
        var operatorIndex = getCentralOperationIndex(formula, symbol);
        if (operatorIndex >= formula.length) {
            return false;
        }
        var formulaElements = [];
        formulaElements[0] = formula.slice(0, operatorIndex);
        formulaElements[1] = formula.slice(operatorIndex + 1, formula.length);
        for (var i = 0; i < formulaElements.length; i++) {
            if (checkSymbols(formulaElements[i])) {
                result = true;
            } else if (checkUnaryFormula(formulaElements[i])) {
                result = true;
            } else if (checkException(formulaElements[i])) {
                result = true;
            } else {
                result = false;
                break;
            }
        }
    }
    return result;
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
    return formula;
}

function checkUnaryFormula(formula) {
    if (formula.indexOf("(") === 0) {
        formula = removeOuterBrackets(formula);
    }
        var check = /^!?[A-Z]{1}$/;
        return check.test(formula);
}
/*
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
*/
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
            } else if (checkException(formulaElements[i])) {
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

function generateTest(){
    var result ="";
    result +="(";
    if (Math.round(Math.random()-0.8)){
        result += generateTest();
    }
    else{
        if (Math.round(Math.random()-0.8)){
            result +="(!";
            result += characters.charAt(Math.floor(Math.random() * characters.length));
            result +=")";        
        }
        else{
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    }
    if (Math.round(Math.random())){
        result += "&";
    }
    else{
        result += "|";
    }
    if (Math.round(Math.random()-0.8)){
        result += generateTest();
    }
    else{
        if (Math.round(Math.random()-0.8)){
            result +="(!";
            result += characters.charAt(Math.floor(Math.random() * characters.length));
            result +=")";        
        }
        else{
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    }
    result +=")";
    return result; 
}

function test(){
    if (testNumber<5){
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
        if (testNumber===5){
            document.getElementById("formula").value = "Тест окончен";
            document.getElementById("score").innerHTML ="Правильных ответов - "+score+" из 5";
        }
        else{
            document.getElementById("formula").value = generateTest();
        }
    }
}

function test25(){
    document.getElementById("result").innerHTML = "Test successful";
    console.log("true = КНФ, false = Не КНФ")
    for (var j = 0; j < tests.length; j++) {
        var result = false;        
        if (checkException(tests[j]) && checkBracketsNum(tests[j])) {
            result = checkException(tests[j]);
        }
        else
        if (tests[j].includes( "&") && tests[j].includes( "(") && tests[j].includes( ")") && checkBracketsNum(tests[j])) {
            result = checkBinaryFormula(tests[j]);
        } 
        else if (tests[j].includes( "!") && tests[j].includes( "(") && tests[j].includes( ")") && checkBracketsNum(tests[j])) {
            result = checkUnaryFormula(tests[j]);
        }
        else {
            result = checkSymbols(tests[j]);
        }
        conjNum = 0;
        if (result === testResults[j]){
            console.log("formula "+tests[j]+", get "+result+", expected "+testResults[j]);
        }
        else {
            document.getElementById("result").innerHTML = ("Test "+(j+1)+" failed: "+"formula "+tests[j]+", get "+result+", expected "+testResults[j]);
            break;
        }
    }
}