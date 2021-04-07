    //gameon
    let body = document.getElementsByTagName("BODY")[0];
    
    
    let canvasEl = document.createElement("container");
    let text = document.createTextNode("game Over!!");
    gO.appendChild(text);
    body.appendChild(gO);





    //gameover
    body = document.getElementsByTagName("BODY")[0];
    let gO = document.createElement("div");
    let textGo = document.createTextNode("game Over!!");
    gO.appendChild(textGo);
    body.appendChild(gO);

    //winner
    body = document.getElementsByTagName("BODY")[0];
    let win = document.createElement("div");
    let textWin = document.createTextNode("You Won!!");
    gO.appendChild(textWin);
    body.appendChild(gO);

    
