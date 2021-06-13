/*let allInput = document.getElementsByTagName('input');
for (var ele of allInput) {
    ele.onchange = () => {
        var thingy = ele.id.replace('-input', '');
        let element = document.getElementsByClassName(thingy)[0];
        if (ele.checked == true) {
            element.style.width = "calc(50% - 32px)";
            element.style.height = "calc(50% - 32px)";
            element.style.margin = "16px";
        } else if (ele.checked == false) {
            element.style.width = "calc(50% - 16px)";
            element.style.height = "calc(50% - 16px)";
            element.style.margin = "8px";
        }
    }
}*/