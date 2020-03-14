if (window.addEventListener) window.addEventListener("load", init, false);
else if (window.attachEvent) window.attachEvent("onload", init);

function init() {
    document.querySelector("input[name=userName]").onchange=nameOnChange;
    document.querySelector("input[name=email]").onchange=emailOnChange;
    document.querySelector("input[name=zip]").onchange=zipcodeOnChange;
    document.querySelector("form[name=form1]").onsubmit = onsubmitHandler;
}

function validate(elem, pattern) {
    var res = pattern.test(elem.value);
    if (res === false) {
        elem.className = "invalid";
    } 
    else {
        elem.className = "valid";
    }
}

function nameOnChange() {
    var pattern = /\S/;
    validate(this, pattern);
}

function emailOnChange() {
    var pattern = /\b[a-z0-9._]+@[a-z0-9.-]+\.[a-z]{2,4}\b/i;
    validate(this, pattern);
}

function zipcodeOnChange() {
    var pattern = /\d{5}/;
    validate(this, pattern);
}

function onsubmitHandler(event) {
    for (var i = 0; i < form1.elements.length; ++i) {
        if (form1.elements[i].type === "text")
            form1.elements[i].className = "valid";
    }

    var invalid = false;

    for (var i = 0; i < form1.elements.length; ++i) {
        var elem = form1.elements[i];
        if (elem.type == "text" && elem.onchange) {
            elem.onchange(); 
            if (elem.className == "invalid") invalid = true;
        }
    }

    if (invalid) {
        alert("Допущены ошибки при заполнении формы.");
        event.preventDefault();
        return false;
    }
}