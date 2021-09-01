document.addEventListener("DOMContentLoaded", function () {
    //Globals
    var chPaper = document.querySelector(".ch-paper");
    var chColorFrom = document.querySelectorAll(".ch-color-from");
    var chColorTo = document.querySelectorAll(".ch-color-to");
    var chGradient = document.querySelectorAll(".ch-gradient");
    var chCode = document.querySelectorAll(".ch-code");
    var chGrab = document.querySelectorAll(".ch-grab");
    var notifyPlank = document.querySelector(".ch-notify-plank");
    var backgroundImage = "background-image: ";
    var gradientType = "linear-gradient( 135deg, ";
    var gradientStart = " 10%, ";
    var gradientEnd = " 100%)";
    var colorData;
    var chStarCount = document.querySelector(".ch-starcount");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "scripts/colourful.json", true);
    xhr.send();

    var colourfulThread = new Promise(function (resolve, reject) {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(this.responseText);
            }
        }
    });

    colourfulThread.then(function (data) {
        colorData = JSON.parse(data);
        renderPaper();
    });

    var renderPaper = function () {
        for (var i = 0; i < colorData.length; i++) {
            tempColorFrom = colorData[i][0];
            tempColorTo = colorData[i][1];
            var tempImage = gradientType + tempColorFrom + gradientStart + tempColorTo + gradientEnd;

            var nodeGradientBrick = document.createElement("div");
            nodeGradientBrick.classList.add("ch-gradient-brick");
            var nodeGradient = document.createElement("div");
            nodeGradient.classList.add("ch-gradient");
            nodeGradient.style.backgroundImage = tempImage;
            var nodeActions = document.createElement("div");
            nodeActions.classList.add("ch-actions");
            var nodeCode = document.createElement("a");
            nodeCode.classList.add("ch-code");
            nodeCode.dataset.colorFrom = tempColorFrom;
            nodeCode.dataset.colorTo = tempColorTo;

            var nodeGrab = document.createElement("a");
            nodeGrab.classList.add("ch-grab");
            nodeGrab.dataset.colorFrom = tempColorFrom;
            nodeGrab.dataset.colorTo = tempColorTo;

            var nodeColors = document.createElement("div");
            nodeColors.classList.add("ch-colors");

            var nodeColorFrom = document.createElement("span");
            nodeColorFrom.classList.add("ch-color-from");
            var nodeColorFromText = document.createTextNode(tempColorFrom);

            var nodeColorTo = document.createElement("span");
            nodeColorTo.classList.add("ch-color-to");
            nodeColorTo.style.color = tempColorTo;

            var nodeColorToText = document.createTextNode(tempColorTo);

            //Append to Paper
            nodeGradientBrick.appendChild(nodeGradient);
            nodeActions.appendChild(nodeCode);
            nodeActions.appendChild(nodeGrab);
            nodeGradient.appendChild(nodeActions);
            nodeColors.appendChild(nodeColorFrom);
            nodeColorFrom.appendChild(nodeColorFromText);
            nodeColors.appendChild(nodeColorTo);
            nodeColorTo.appendChild(nodeColorToText);
            nodeGradientBrick.appendChild(nodeColors);
            chPaper.appendChild(nodeGradientBrick);
        }
    }

    var colourfulAction = function (event) {
        //Copy Code
        if (event.target.matches(".ch-code")) {
            var eventColorFrom = event.target.dataset.colorFrom;
            var eventColorTo = event.target.dataset.colorTo;
            var eventResult = backgroundImage + gradientType + eventColorFrom + gradientStart + eventColorTo + gradientEnd + ";";

            function dynamicNode() {
                var node = document.createElement("pre");
                node.style.position = "fixed";
                node.style.fontSize = "0px";
                node.textContent = eventResult;
                return node;
            };

            var node = dynamicNode();
            document.body.appendChild(node);

            var selection = getSelection();
            selection.removeAllRanges();
            var range = document.createRange();
            range.selectNodeContents(node);
            selection.addRange(range);

            document.execCommand('copy');
            selection.removeAllRanges();
            document.body.removeChild(node);

            function notifyClient() {

                notifyPlank.classList.add("ch-notify-plank");
                var notify = document.createElement("span");
                notify.classList.add("ch-notify", "ch-notify-animate");
                var notifyText = document.createTextNode("CSS3 Code Copied! 👍");
                notify.appendChild(notifyText);
                notifyPlank.appendChild(notify);
                Swal.fire({
                    icon: 'success',
                    title: '"CSS3 Code Copied! 👍"',
                    text: 'You can now  paste the code in your css file for some cool style🤩😎',
                })
            }
            notifyClient();
            var removeNotify = function () {
                var notify = document.querySelectorAll(".ch-notify")[0];
                notifyPlank.removeChild(notify);
            };
            setTimeout(removeNotify, 2000);
        }

        //Grab Palette
        if (event.target.matches(".ch-grab")) {
            var eventColorFrom = event.target.dataset.colorFrom;
            var eventColorTo = event.target.dataset.colorTo;
            var canvas = document.createElement("canvas");
            canvas.width = "1000";
            canvas.height = "1000";
            var ctx = canvas.getContext("2d");
            var tempGradient = ctx.createLinearGradient(0, 0, 1000, 1000);
            tempGradient.addColorStop(0, eventColorFrom);
            tempGradient.addColorStop(1, eventColorTo);
            ctx.fillStyle = tempGradient;
            ctx.fillRect(0, 0, 1000, 1000);
            var dataURL = canvas.toDataURL();
            event.target.href = dataURL;
            var fileName = "colourful-" + eventColorFrom.slice(1, 7) + "-" + eventColorTo.slice(1, 7);
            event.target.setAttribute("download", fileName);
        }
    }
    window.onclick = function (event) {
        colourfulAction(event);
    }
    window.ontouchstart = function (event) {
        colourfulAction(event);
    }
});