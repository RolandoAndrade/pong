let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const HEIGHT = 300;
const WIDTH = 500;

class Player extends Rectangle
{
    constructor(x,y, ball)
    {
        super(x,y,15,60,"#3bdfff");
        this.ball = ball;
        if(!ball)
        {
            let ax = this;
            document.addEventListener("keydown",function (e)
            {
                if (e.keyCode === 38)
                {
                    ax.up();
                }
                else if (e.keyCode === 40)
                {
                    ax.down();
                }

            })
        }

        this.vy = 10;
        ctx.textAlign="center";
        this.score = 0;
    }

    moveAuto()
    {
        if (this.ball.y < this.y -  Math.random()*25)
        {
            this.y -= 10;
        }
        else if (this.ball.y - Math.random()*25> this.y + this.h)
        {
            this.y += 10;
        }
    }

    move(y)
    {
        this.y += y;
    }

    up()
    {
        this.move(-this.vy);
        this.y = Math.max(0,this.y);
    }

    down()
    {
        this.move(this.vy);
        this.y = Math.min(this.y, HEIGHT-this.h);
    }

    contains(side, top, bottom, leftOffset, rightOffset)
    {
        return this.x-leftOffset<=side&&side<=this.x+this.w+rightOffset&&this.y<=bottom&&top<=this.y+this.h
    }
    draw()
    {
        ctx.font ='100px Arial, sans-serif';
        ctx.fillStyle="#A3A3A3";
        if(!this.ball)
            ctx.fillText(""+this.score,150,175);
        else
            ctx.fillText(""+this.score,350,175);
        super.draw();
    }

}


class Ball extends Circle
{
    constructor(x,y)
    {
        super(x,y,5,"#8effd0");
        this.startX = x;
        this.startY = y;
        this.VX = 2;
        this.VY = 2;
        this.vx = 2;
        this.vy = 2;
    }
    move(x, y)
    {
        this.x += this.vx;
        this.y += this.vy;
    }

    collision(p1, p2)
    {
        if(this.y-this.radius<=0)
        {
            this.y = this.radius;
            this.vy*=-1;
        }
        else if(this.y+this.radius>=HEIGHT)
        {
            this.y = HEIGHT - this.radius;
            this.vy*=-1;
        }
        if(p1.contains(this.x-this.radius, this.y-this.radius, this.y+this.radius, 0, 0))
        {
            this.vx *= -1;
            this.vx += 0.1;
            this.x = p1.x + p1.w + this.radius;
            this.vy = -this.VY * Math.cos((p1.y-this.y+this.radius)*Math.PI/60)

        }
        else if(p2.contains(this.x+this.radius, this.y-this.radius, this.y+this.radius, 0, 0))
        {
            this.vx *= -1;
            this.vx -= 0.1;
            this.x = p2.x - this.radius;
            this.vy = -this.VY * Math.cos((p2.y-this.y+this.radius)*Math.PI/60)
        }

        if(this.x<p1.x)
        {
            p2.score++;
            this.vx = this.VX;
            this.vy = this.VY;
            this.x = this.startX;
            this.y = this.startY;
        }
        if(this.x>p2.x)
        {
            p1.score++;
            this.vx = -this.VX;
            this.vy = -this.VY;
            this.x = WIDTH-this.startX;
            this.y = this.startY;
        }

    }

    draw(p1, p2)
    {
        this.move();
        this.collision(p1, p2);
        super.draw();

    }
}





let ball = new Ball(100,HEIGHT/2);
let p1 = new Player(10,10);
let p2 = new Player(475,10, ball);


let i = 0;
function loop()
{
    new Rectangle(0,0,500,300, "#333").draw();
    p1.draw();
    p2.moveAuto();
    p2.draw();
    ctx.fillStyle="#A3A3A3";
    ctx.font ='10px Arial, sans-serif';
    ctx.fillText("Rolando Andrade",250,270);
    ball.draw(p1,p2);
}

window.setInterval(loop,8);

p1.draw();
p2.draw();