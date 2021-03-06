let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let clickBox = document.querySelector("button");

const canvasWidth = canvas.width = 500;
const canvasHeight = canvas.height = 500;

let maxtime=6;
let counter={};
let strState = ['STAY','MOVE'];

let locateX,locateY,xy;

let sprite_imge = new Image();
let cycleArr = [0,1,2,3];
let frameX=64;
let frameY=64;
sprite_imge.src = './images/133.png';

class Main {
    constructor()
    {
        this.objArr=[];
        this.objArr_copy=[];
    }
    update()
    {
        this.objArr.forEach(function(object){
            switch(object.state)
            {
                case 'MOVE':
                    object.moveUpdate();
                    break;
                case 'STAY':
                    object.stayUpdate();
                    break;
            }
        });
        this.draw();
    }
    draw()
    {
        this.objArr.forEach(function(object){object.objDraw()});
    }
    addNewObj()
    {
        this.objArr.push(new Obj());
        this.objArr_copy.push(new copyObj());
        console.log(this.objArr);
        console.log(this.objArr_copy);
    }
}

class Obj {
    constructor() 
    {
        this.state = strState[Math.floor(Math.random()*2)];
        this.width = 80;
        this.height = 80;
        this.x = Math.floor(Math.random()*(canvasWidth-this.width));
        this.y = Math.floor(Math.random()*(canvasHeight-this.height));
        this.goal = null;

        this.timer = this.setTimer();
        this.calcTimer = this.timer*60;
        this.timerCnt=0;

        this.going=false;

        this.animateState=null;
        this.frameCnt=0;
    }
    moveUpdate() 
    {
        if(this.going === true)
        {
            this.gotoXY(this.goal);
        }
        else if(this.going === false)
        {
            this.goal = this.setXY();
        }
    }
    stayUpdate()
    {
        this.timerCnt=0;
        this.timer = this.setTimer();
        this.calcTimer = this.timer*60;
        this.going=false;
        this.state='MOVE';
    }
    objDraw()
    {
        ctx.drawImage(sprite_imge,(frameX*Math.floor(this.frameCnt)),frameY*cycleArr[this.animateState],70,70,this.x,this.y,this.width,this.height);
        this.frameCnt+=0.125;
        if(this.frameCnt>3)
        {
            this.frameCnt=0;
        }
    }
    setXY()
    {
        locateX=0;
        locateY=0;
        xy=0;
        // console.log(this.x,this.y);
        xy = Math.floor(Math.random()*2);
        if(xy===0)
        {
            locateX = Math.floor(Math.random()*(canvasWidth-this.width));
            if(locateX === this.x)
            {
                locateX = locateX+100;
                if(locateX>(canvasWidth-this.width))
                {
                    locateX = locateX-200;
                }
            }
            this.going=true;
            return {xy,locateX};
        }
        else if(xy===1)
        {
            locateY = Math.floor(Math.random()*(canvasHeight-this.height));
            if(locateY === this.y)
            {
                locateY = locateY+100;
                if(locateY>(canvasWidth-this.height))
                {
                    locateY = locateY-200;
                }
            }
            this.going=true;
            return {xy,locateY};
        }

    }
    gotoXY(object)
    {
        if(object.xy===0)
        {
            // console.log(this.x,object.xy,object.locateX);
            if(this.x<object.locateX)
            {
                this.x++;
                copyObj.x++;
                this.animateState=2;
            }
            else if(this.x>object.locateX)
            {
                this.x--;
                copyObj.x--;
                this.animateState=1;
            }
            this.checkAchieve(this.x,object.locateX);
            
        }
        else if(object.xy===1)
        {   
            // console.log(this.y,object.xy,object.locateY);
            if(this.y<object.locateY)
            {
                this.y++;
                copyObj.y++;
                this.animateState=0;
            }
            else if(this.y>object.locateY)
            {
                this.y--;
                copyObj.y--;
                this.animateState=3;
            }
            this.checkAchieve(this.y,object.locateY);
        }
    }
    setTimer()
    {
        return Math.floor(Math.random()*maxtime)+2;
    }
    checkAchieve(locate,goalLocate)
    {
        if(locate === goalLocate)
        {
            this.timerCnt++;
            if(this.calcTimer/this.timerCnt===1)
            {
                this.state='STAY';
            }
        }
    }
}

class copyObj{
    constructor()
    {
        this.x = Obj.x;
        this.y = Obj.y;
    }
}

const main = new Main();
 
function animate()
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    main.update();
    requestAnimationFrame(animate);
}

animate();
clickBox.addEventListener('click', function () {
    main.addNewObj();
});