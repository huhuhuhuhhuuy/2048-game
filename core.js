//创建一个game对象，游戏的所有属性和方法都放在这个对象中
var game={
    //以下是game的属性
    data:[],//添加一个属性，用于存储游戏数据
    score:0,//添加得分属性
    status:0,//添加一个游戏状态
    gameOver:0,//添加一个游戏结束的状态
    gameRunning:1,//添加一个游戏开始的状态
    rn:4,//总行数
    cn:4, //总列数
    
}

  //以下是game的方法

game.isGameOver=function(){  //判断游戏状态是否结束 ，看满了没
    if(!this.isFull()){  //朋友们等会写个判断满了没得函数，这尼玛怕不是个闭包
        return false;       //没满返回false

    }else{                  //下面是满的处理方式 ，在满了的情况下考虑是不是死局
        //从左上角第一个元素开始遍历整个数组
        for(let row=0;row<this.rn;row++){
            for(let col=0;col<this.cn;col++){
                if(col<this.cn-1){  //是否与右侧相同
                    if(this.data[row][col]==this.data[row][col+1]){
                        return false;
                    }
                }

                if(row<this.rn-1){  //是否与下侧相同
                    if(this.data[row][col]=this.data[row+1][col]){
                        return false;
                    }
                }
            }
        }
        return true
    }
}

game.start=function(){  //开始游戏
    this.status=this.gameRunning ;

    //先隐藏游戏结束界面
    var over=document.getElementById('over');
    over.style.display="none";

    //初始化二维数组
    this.data=[
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];
    
    this.score=0; //重置分数为0
    this.randomNum();//随机两个数字为随机位置的坐标
    this.randomNum();//随机两个位置生成2/4
    this.updateView();//将数据更新到地面
}

//over里的isFull
game.isFull=function(){     //判断数组是否已满
    for(let row=0;row<this.rn;row++){
        for(let col=0;col<this.cn;col++){
            if(this.data[row][col]==0){
                return false;
            }
        }
    }
    //没有一个位置为0了
    return true;
}

//start里的randomNum
game.randomNum=function(){  //随机空位生成一个数
    if(!this.isFull()){ //如果不满才生成
        while(true){//循环true,就是立即调用
            let row =parseInt(Math.random()*this.rn); //随机行号,parseInt=Math.floor(),即向下取整
            let col =parseInt(Math.random()*this.cn);

            if(this.data[row][col]==0){
                this.data[row][col]=Math.random()<0.5?2:4;
                break;//停止循环，也就是说如果不是空位，他就不会break，然而一直循环
            }

        }
    }
}

game.updateView=function(){
    //将二维数组的每个格的数字放入前景格中
    for(let row=0;row<this.rn;row++){
        for(let col=0;col<this.cn;col++){
            var div=document.getElementById("c"+row+col); //获取页面格子
            var curr=this.data[row][col];//当前的元素值
            //将元素值传递到格子里
            div.innerHTML=curr!=0?curr:""; //判断传递内容。若为0则传空，传递的是数字这个时候
            div.className=curr!=0?("box1 n"+curr):"box1" //更改样式显示

        }
    }

//记录积分，以及积分的计算
var h2=document.getElementById("score");
h2.innerHTML=this.score; //记得写积分计算函数

//游戏结束时清零
if(this.isGameOver()){ 
    this.status=this.gameOver;  //调内核状态
    var over=document.getElementById("over");
    var fs=document.getElementById("finalScore");
    fs.innerHTML=this.score; //这个元素显示为分数
    //样式记得清零
    over.style.display="block"; //将这个遮盖层显示为块元素，覆盖第一步，样式为块元素
    }
}

//移动方式实现
// 左移 1.2.3.是逐层向上调用

//1.找到当前位置的右侧，下一个不为0的数
game.getRightNext=function(row,col){   //离谱，我现在看不出这个数是哪里传进来的,好的后面破案了，这个是循环调用，这两个值是后面传进来的
    //循环变量：nextC--->指下一个元素的列下标
    //从col+1开始，遍历row行中剩余元素，<cn结束
    for(var nextC=col+1;nextC<this.cn;nextC++){
        //如果遍历的元素！=0
        if(this.data[row][nextC]!=0){ //就找到右侧第一个不为0的数字就好了
            //就返回nextC
            return nextC;     //😄返回这个下个元素列下标有啥用？
        }
    }return -1; //(循环正常退出)，就返回-1，返回-1也就意味着这排是满的

}
//2.判断并左移，指定行中的每个元素，单行内部
game.moveLeftInRow=function(row){   //看到这种只传入了一个数字的理所当然的想到下面会有循环遍历调用传入
    //col从0开始，遍历row行中的每个元素，<cn-1结束
    for(var col=0;col<this.cn-1;col++){
        //获取当前元素的下一个不为0的元素的下标nextC
        var nextC=this.getRightNext(row,col);
        //判断全满的情况
        if(nextC==-1){  //全满就不用移动
            break;
        }else{  //左移开始
            if(this.data[row][col]==0){ //空位处理
                this.data[row][col]=this.data[row][nextC];
                this.data[row][nextC]=0;
            }else if(this.data[row][col]==this.data[row][nextC]){ //叠加处理
                this.data[row][col]*=2;
                this.data[row][nextC]=0;
                this.score+=this.data[row][col]; //记分记得是有操作的的块的分

            }
        }
    }
}
//3.移动所有的行 多行左移
game.moveLeft=function(){
    var oldStr=this.data.toString();    //神奇！这个属于是有点类似截图对比前后了，数组转字符串
    //循环遍历每一层
    for(var row=0;row<this.rn;row++){
        //每一行都调用单行元素原理
        this.moveLeftInRow(row);
    }
    var newStr=this.data.toString();
    if(oldStr!=newStr){
        this.randomNum();
        this.updateView();
    }
}





//右移
game.getLeftNext=function(row,col){  
    for(var nextC=col-1;nextC>=0;nextC--){
        if(this.data[row][nextC]!=0){ 
            return nextC;    
        } 
    }return -1;
}

game.moveRightInRow=function(row){  
    for(var col=this.cn-1;col>0;col--){
        var nextC=this.getLeftNext(row,col);
        if(nextC==-1){
            break;
        }else{ 
            if(this.data[row][col]==0){ 
                this.data[row][col]=this.data[row][nextC];
                this.data[row][nextC]=0;
            }else if(this.data[row][col]==this.data[row][nextC]){ //叠加处理
                this.data[row][col]*=2;
                this.data[row][nextC]=0;
                this.score+=this.data[row][col]; 
            }
        }
    }
}

game.moveRight=function(){
    var oldStr=this.data.toString();   

    for(var row=0;row<this.rn;row++){
   
        this.moveRightInRow(row);
    }
    var newStr=this.data.toString();

    if(oldStr!=newStr){
        this.randomNum();
        this.updateView();
    }
}

//上移

game.moveUp=function(){
    var oldStr=this.data.toString();
    for(var col=0;col<this.cn;this.moveUpInCol(col++));
    var newStr=this.data.toString();
     if(oldStr!=newStr){
      this.randomNum();
      this.updateView();
     }
}
game.moveUpInCol=function(col){
    for(var row=0;row<this.rn-1;row++){
         var nextR=this.getDownNext(row,col);
         if(nextR==-1){ break; 
         }else{
          if(this.data[row][col]==0){
           this.data[row][col]=
             this.data[nextR][col];
           this.data[nextR][col]=0;
           row--;
          }else if(this.data[row][col]==
             this.data[nextR][col]){

           this.data[row][col]*=2;

           this.data[nextR][col]=0;

           this.score+=this.data[row][col];
          }
         }
        }
}

game.getDownNext=function(row,col){
    for(var nextR=row+1;nextR<this.rn;nextR++){
        if(this.data[nextR][col]!=0){
         return nextR;
        }
       }return -1;
}


    /*下移所有列*/
game.moveDown=function(){
        var oldStr=this.data.toString();
      for(var col=0;col<this.cn;this.moveDownInCol(col++));
        var newStr=this.data.toString();
        if(oldStr!=newStr){
         this.randomNum();
         this.updateView();
        }
       }
game.moveDownInCol=function(col){
        //row从this.rn-1，到>0结束，row--
        for(var row=this.rn-1;row>0;row--){
         var nextR=this.getUpNext(row,col);
         if(nextR==-1){
          break;
         }else{
          if(this.data[row][col]==0){
           this.data[row][col]=
             this.data[nextR][col];
           this.data[nextR][col]=0;
           row++;
          }else if(this.data[row][col]==
             this.data[nextR][col]){
           this.data[row][col]*=2;
           this.data[nextR][col]=0;
           this.score+=this.data[row][col];
          }
         }
        }
       }

game.getUpNext=function(row,col){
    for(var nextR=row-1;nextR>=0;nextR--){
     if(this.data[nextR][col]!=0){
      return nextR;
     }
    }return -1;
   }
  

  //onload事件：页面加载后自动执行
window.onload=function(){
      game.start();
      console.log(this.data);
      document.onkeydown=function(){
          if(game.status==game.gameRunning){
              var e=window.event||arguments[0];//获取事件对象；
              if(e.keyCode==37){
                  game.moveLeft();
              }else if(e.keyCode==38) {
                    game.moveUp();
              }else if(e.keyCode==39) {
                    game.moveRight();
              }else if(e.keyCode==40) {
                    game.moveDown();
              }
          }
      }
  }
  