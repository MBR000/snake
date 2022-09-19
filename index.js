//原版本两个定时器，200ms移动一次，100ms检测一次，两个时钟独立
//现在改成用一个了，缺点是出界以后alert了还要再动一下

function SnakeInit() {
    this.dom = {
        'btn' : document.getElementsByClassName('startGame')[0],
        'main' : document.getElementsByClassName('gameAera')[0],
        'actScore' : document.getElementsByClassName('actScore')[0],
    };
    this.timer;
    this.bodyPosition = {x:[],y:[]};
    this.applePosition = {x:null, y:null};
    this.detectPosition = {x:[],y:[]};
    this.currentDiret = "";   //当前移动的方向
    this.bindStartEvent();   //绑定键盘、点击事件 
    this.score = 0;
}

SnakeInit.prototype.bindStartEvent = function () {
    var self = this;
    this.dom.btn.addEventListener('click',function () {
        this.style.display = "none" ;
        self.init('right');
    },false);  
}

SnakeInit.prototype.cashDectet = function () {
    var snakeHead = document.getElementById('snakeHead'),
        snakeBlock = document.getElementById('snakeBlock'),
        snakeBody = document.getElementsByClassName('snakeBody'),
        self = this;

        var x = parseInt(getComputedStyle(snakeHead).left),
            y = parseInt(getComputedStyle(snakeHead).top),
            Bx = parseInt(getComputedStyle(snakeBlock).left),
            BY = parseInt(getComputedStyle(snakeBlock).top),
            len = snakeBlock.children.length;

            //  block的位置是随机的，出现后就不动了，是相对左上角的距离。
            //  head又是相对block的距离，所以两个相加就是对左上角的偏移量
            //框是1200*600的，每一格40
        if((x + Bx) < 0 || (x + Bx > 1160)){
            alert("Game Over! Your Score Is : " + self.score);
            clearInterval(self.timer);

        }else if((y + BY) < 0 || (y + BY) > 560){
            alert("Game Over! Your Score Is : " + self.score);
            clearInterval(self.timer);
           
        }

        for(var i = 0; i < len; i++){
            self.detectPosition.x[i] = parseInt(getComputedStyle(snakeBlock.children[i]).left);
            self.detectPosition.y[i] = parseInt(getComputedStyle(snakeBlock.children[i]).top);
        }
        for(var i = 1; i < len; i++){
            if(x == self.detectPosition.x[i]){
                if(y == self.detectPosition.y[i]){
                    alert("Game Over! Your Score Is : " + self.score);
                    clearInterval(self.timer);

                }
            }
        }
        
}

SnakeInit.prototype.bindKeyEvent = function () {
    var snakeHead = document.getElementById('snakeHead'),
        snakeBody = document.getElementsByClassName('snakeBody'),
        snakeBlock = document.getElementById('snakeBlock'),
        len = snakeBody.length,
        self = this;
        document.addEventListener('keydown',function (e) {
        e.preventDefault();
        switch(e.key) {
            case 'ArrowDown' : 
                // console.log(e.key);
                if(self.currentDiret == "up" || self.currentDiret == "down"){
                    break;
                }
                self.move("down"); break;
            case 'ArrowUp' : 
                if(self.currentDiret == "up" || self.currentDiret == "down"){
                    break;
                }               
                self.move("up"); break;
            case 'ArrowLeft' : 
                if(self.currentDiret == "left" || self.currentDiret == "right"){
                    break;
                }
                self.move("left"); break;
            case 'ArrowRight' :
                if(self.currentDiret == "left" || self.currentDiret == "right"){
                    break;
                } 
                self.move("right"); break;
        }
        return false;
    } )
}

SnakeInit.prototype.move = function (direction) {
    //每一次按键以后都要重启时钟，重新给满反应需要的时间
    if(this.timer){
        clearInterval(this.timer);
    }
    var snakeBlock = document.getElementById('snakeBlock'),
    snakeHead = document.getElementById('snakeHead'),
    snakeBody = document.getElementsByClassName('snakeBody'),
    x = parseInt(getComputedStyle(snakeHead).left),
    y = parseInt(getComputedStyle(snakeHead).top),  
    self = this;

    // console.log("getComputedStyle(snakeBlock).left",parseInt(getComputedStyle(snakeBlock).left))
    // console.log("getComputedStyle(snakeBlock).top",parseInt(getComputedStyle(snakeBlock).top))

    this.timer = setInterval(function () {
        self.cashDectet()
        var len = snakeBlock.children.length;
        for(var i = 0; i < len; i++){
            self.bodyPosition.x[i] = parseInt(getComputedStyle(snakeBlock.children[i]).left);
            self.bodyPosition.y[i] = parseInt(getComputedStyle(snakeBlock.children[i]).top);
        }
        if(document.getElementsByClassName('apple')){                         //判断游戏中是否出现了食物
            var apple = document.getElementsByClassName('apple');

            self.applePosition.x = parseInt(getComputedStyle(apple[0]).left);
            self.applePosition.y = parseInt(getComputedStyle(apple[0]).top);

        }
        switch(direction) {
            case "right" : 
                snakeHead.style.left = self.bodyPosition.x[0] + 40 + "px";
                snakeHead.style.transform = "rotateZ(0deg)";
                self.currentDiret = "right";
                for(var i = 0; i < len -1; i ++){
                    snakeBody[i].style.left = self.bodyPosition.x[i] + "px";
                    snakeBody[i].style.top = self.bodyPosition.y[i] + "px";
                }
                break;
            case "left" :
                snakeHead.style.left = self.bodyPosition.x[0] - 40 + "px";
                snakeHead.style.transform = "rotateZ(180deg)" ;
                self.currentDiret = "left";
                for(var i = 0; i < len -1; i ++){
                    snakeBody[i].style.left = self.bodyPosition.x[i] + "px";
                    snakeBody[i].style.top = self.bodyPosition.y[i] + "px";
                }
                break;
            case "up" :
                snakeHead.style.top = self.bodyPosition.y[0] - 40 + "px";
                snakeHead.style.transform = "rotateZ(-90deg)" ;
                self.currentDiret = "up";
                for(var i = 0; i < len -1; i ++){
                    snakeBody[i].style.left = self.bodyPosition.x[i] + "px";
                    snakeBody[i].style.top = self.bodyPosition.y[i] + "px";
                }
                break;
            case "down" :
                snakeHead.style.top = self.bodyPosition.y[0] + 40 + "px";
                snakeHead.style.transform = "rotateZ(90deg)";
                self.currentDiret = "down";
                for(var i = 0; i < len -1; i ++){
                    snakeBody[i].style.left = self.bodyPosition.x[i] + "px";
                    snakeBody[i].style.top = self.bodyPosition.y[i] + "px";
                }
                break;
        }
        if(apple){
            var mapX = parseInt(getComputedStyle(snakeHead).left) + parseInt(getComputedStyle(snakeBlock).left),
                mapY = parseInt(getComputedStyle(snakeHead).top) + parseInt(getComputedStyle(snakeBlock).top);

            if(mapX == self.applePosition.x && mapY == self.applePosition.y){
                self.addBody(mapX,mapY);
            }

        }
        self.dom.actScore.innerHTML = self.score;
        
    },200)
}
SnakeInit.prototype.addBody = function (x,y) {
    //  删除苹果  新加入苹果   加长身体
    var apple = document.getElementsByClassName('apple');
    var snakeBody = document.createElement('div'),
        snakeBlock = document.getElementById('snakeBlock');
        len = snakeBlock.children.length;
    this.dom.main.removeChild(apple[0]);
    snakeBody.className = "snakeBody"
    snakeBody.style.left = this.bodyPosition.x[len-1] +"px";
    snakeBody.style.top = this.bodyPosition.y[len-1] + "px" ;
    snakeBlock.appendChild(snakeBody);
    this.generate();
    this.score++;
}

SnakeInit.prototype.generate = function (n) {
        var apple = document.createElement('div');
        let x = Math.floor(Math.random()*30) * 40;
        let y = Math.floor(Math.random()*15) * 40;
        apple.className = "apple";
        apple.style.left = x + "px";
        apple.style.top = y + "px";
        this.dom.main.appendChild(apple);
}
SnakeInit.prototype.init = function (direction) {
    var self = this,
        bodyPositionX = 40,
        bodyPositionY = 40; 
    var positionX = Math.floor(Math.random() * 12 + 3) * 40,
        positionY = Math.floor(Math.random() *15) * 40,
        moveLeft = positionX;
    var snakeBlock = document.createElement('div'),
        snakeHead = document.createElement('div');
    snakeBlock.id = 'snakeBlock';
    snakeBlock.style.left = positionX + "px";
    snakeBlock.style.top = positionY + "px";
//  这里决定的snakeblock随机出现的位置，的确是个bfc

    snakeHead.id = 'snakeHead';
    snakeBlock.appendChild(snakeHead);
    for(var i = 0; i < 3; i++) {
       var snakeBody = document.createElement('div');
       snakeBody.className = 'snakeBody';
       snakeBody.style.left = -bodyPositionX + 'px';
       bodyPositionX += 40;
       snakeBlock.appendChild(snakeBody);
    }
    this.dom.main.appendChild(snakeBlock);
    this.move('right');
    this.currentDiret = direction;
    this.bindKeyEvent();
    this.generate();

}

var snake = new SnakeInit();
