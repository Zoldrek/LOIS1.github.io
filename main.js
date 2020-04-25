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
function main(){
    var formula = document.getElementById("formula").value.toString();
    if (checkException(formula)) {
        output(checkException(formula));
    }
    else
    if (formula.includes( "&") && formula.includes( "(") && formula.includes( ")") && checkBracketsNum(formula)) {
        output(checkBinaryFormula(formula));
    } 
    else if (formula.includes( "!") && formula.includes( "(") && formula.includes( ")") && checkBracketsNum(formula)) {
        output(checkUnaryFormula(formula));
    }
    else {
        output(checkSymbols(formula));
    }
    conjNum = 0;
}

function checkException(formula){
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
    var result = false;
    var isSymbol = false;
    var isFormula = false;
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
                isSymbol = true;
            } else if (checkUnaryFormula(formulaElements[i])) {
                result = true;
                isSymbol = true;
            } else if (checkException(formulaElements[i])) {
                result = true;
                isFormula = true;
            } else {
                result = false;
                break;
            }
        }
    }
    if (isSymbol === false){
        result = false;
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
    return formula
}

function checkUnaryFormula(formula) {
    if (formula.indexOf("(") === 0) {
        formula = removeOuterBrackets(formula);
    }
    var rightSymbols = formula.match(/[A-Z]/g);
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

function generateTest(){
    var result ="";
    result +="(";
    if (Math.round(Math.random()-0.8)){
        result += generateTest();
    }
    else{
        if (Math.round(Math.random()-0.8)){
            result +="!";        
        }
        result += characters.charAt(Math.floor(Math.random() * characters.length));
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
            result +="!";        
        }
        result += characters.charAt(Math.floor(Math.random() * characters.length));
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
