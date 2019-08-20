var WINDOW_WIDTH = 500; //可自由设置宽度
var WINDOW_HEIGHT = WINDOW_WIDTH * 0.3; //最佳体验就是0.3
var MARGIN_TOP;
var MARGIN_LEFT;

//----------计时器：未来的时间设置------------
// var endTime = new Date();
// endTime.setTime(endTime.getTime() + 10*1000); //10秒钟
// ------------计时器-------------
var currentTime = new Date();
// var currentTime = getSeconds();

var balls = [];
const colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"];

window.onload = function(){
	//全屏测试
	WINDOW_WIDTH = document.body.clientWidth;
	WINDOW_HEIGHT = document.documentElement.clientHeight-10;

	//将数字时间总宽设置为4/5
	MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
	RADIUS = Math.round(WINDOW_WIDTH*4/5/107)-1;
	//将数字时间上边距设置为总高度的1/5
	MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);
	
	var canvasWrap = document.getElementById("canvasWrap");
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");
	
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
	//每秒29帧
	window.setInterval(function(){
		render(context);
		update();
	},35);	
}

function update(){
	var nextTime = new Date();
	// var nextTime = getSeconds()
	
	var curHours = currentTime.getHours();
	var curMinutes = currentTime.getMinutes();
	var curSeconds = currentTime.getSeconds();
	// var curHours = parseInt(currentTime/3600);
	// var curMinutes = parseInt((currentTime-curHours*3600)/60);
	// var curSeconds = currentTime%60;
	
	var nextHours = nextTime.getHours();
	var nextMinutes = nextTime.getMinutes();
	var nextSeconds = nextTime.getSeconds();
	// var nextHours = parseInt(nextTime/3600);
	// var nextMinutes = parseInt((nextTime-nextHours*3600)/60);
	// var nextSeconds = nextTime%60;
	
	//小时的比较
	if(parseInt(curHours/10) != parseInt(nextHours/10)){
		addBalls(MARGIN_LEFT , MARGIN_TOP , parseInt(nextHours/10));
	}
	if(parseInt(curHours%10) != parseInt(nextHours%10)){
		addBalls(MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(nextHours%10));
	}
	//分钟的比较
	if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
		addBalls(MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(nextMinutes/10));
	}
	if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
		addBalls(MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(nextMinutes/10));
	}
	//秒钟的比较
	if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
		addBalls(MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds/10));
	}
	if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
		addBalls(MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10));
	}
	
	currentTime = nextTime;
	
	updateBalls();
}

function updateBalls(){
	for(var i = 0; i < balls.length; i ++){
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy +=balls[i].g;
		//碰撞检测
		if(balls[i].y >= WINDOW_HEIGHT - RADIUS){
			balls[i].y = WINDOW_HEIGHT - RADIUS;
			//反弹后速度减少
			balls[i].vy = -balls[i].vy* 0.6;
		}
	}
	
	var cnt = 0;
	//删除所有不在画面内的小球
	for(var i = 0; i < balls.length; i ++){
		//左边缘和右边缘都在画面中小球都加入0开始的位置上
		if(balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH){
			balls[cnt ++] = balls[i];
		}
	}
	//不在cnt范围的都去掉
	while(balls.length > cnt){
		balls.pop();
	}
}

function addBalls(x, y, num){
	for( var i = 0 ; i < digit[num].length ; i ++ )
	    for(var j = 0 ; j < digit[num][i].length ; j ++ )
	        if( digit[num][i][j] == 1 ){
				var ball = {
					x:x+j*2*(RADIUS+1)+(RADIUS+1),
					y:y+i*2*(RADIUS+1)+(RADIUS+1),
					g:1.5+Math.random(),
					//去-1或者+1的4倍
					vx: Math.pow(-1, Math.ceil(Math.random()*100)) * ((Math.random()+1)*2),
					//不包含-10
					vy: -Math.floor(Math.random()*7),
					//不包含10
					color: colors[Math.floor(Math.random()*colors.length)]
				};
				
				balls.push(ball);
	        }
}


//画笔绘制数字
function render( cxt ){
	//设置时间
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
	// var hours = parseInt(currentTime/3600);
	// var minutes = parseInt((currentTime-hours*3600)/60);
	// var seconds = currentTime%60;
	
	//清空画布
	cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
	//绘制底部时钟
    renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt )
    renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , cxt )
    renderDigit( MARGIN_LEFT + 30*(RADIUS + 1) , MARGIN_TOP , 10 , cxt )
    renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) , cxt);
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);
	//绘制时钟彩球
	for(var i = 0; i < balls.length; i ++){
		cxt.fillStyle = balls[i].color;
		cxt.beginPath();
		cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI);
		cxt.closePath();
		
		cxt.fill();
	}
	
}

//绘制数字的函数
function renderDigit( x , y , num , cxt ){

    cxt.fillStyle = "rgb(0,102,153)";

    for( var i = 0 ; i < digit[num].length ; i ++ )
        for(var j = 0 ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){
                cxt.beginPath();
                cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI )
                cxt.closePath()

                cxt.fill()
            }
}

//计时器：倒计时所剩下的时间
// function getSeconds(){
// 	var cur = new Date();
// 	var ret = endTime.getTime() - cur.getTime();
// 	ret = Math.round(ret/1000);
// 	return ret > 0 ? ret : 0;
// }

