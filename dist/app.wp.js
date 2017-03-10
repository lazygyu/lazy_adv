var _Mathmin=Math.min,_Mathmax=Math.max,_Mathsqrt=Math.sqrt,_Mathpow=Math.pow,_Mathabs=Math.abs,_Mathfloor=Math.floor,_Mathround=Math.round;(function(f){function k(q){if(n[q])return n[q].exports;var u=n[q]={exports:{},id:q,loaded:!1};return f[q].call(u.exports,u,u.exports,k),u.loaded=!0,u.exports}var n={};return k.m=f,k.c=n,k.p="",k(0)})([function(f,k,n){function u(){Z=_,_=performance.now()/1e3;let aa=_-Z,ba=O.getContext("2d");for(T.update(aa,R,U),U.update(aa,T),J.update(aa),R.update();0<U.eventQueue.length;){let da=U.eventQueue.shift();switch(da.command){case"stair":switch(da.dir){case"up":0<Y&&(console.log("up!"),Y--,U=W[Y],T.setPos(U.downPosition.x,U.downPosition.y));break;case"down":Y<W.length-1&&(Y++,U=W[Y],T.setPos(U.startPosition.x,U.startPosition.y));}}}P.save(),P.fillStyle="black",P.fillRect(0,0,270,270),ba.clearRect(0,0,270,270),U.render(P,T.realPos.x,T.realPos.y),U.draw(P,0),U.draw(ba,1),P.drawImage(O,0,0,270,128,0,0,270,128),P.translate(-T.realPos.x+4*F.TILE_SIZE,-T.realPos.y+4*F.TILE_SIZE),T.render(P,[U.ambient].concat(U.lights)),P.restore(),P.save(),P.drawImage(O,0,128,96,32,0,128,96,32),P.drawImage(O,192,128,96,32,192,128,96,32),P.drawImage(O,0,160,270,110,0,160,270,110),P.globalAlpha=0.9,P.drawImage(O,96,128,32,32,96,128,32,32),P.drawImage(O,160,128,32,32,160,128,32,32),P.globalAlpha=0.8,P.drawImage(O,128,128,32,32,128,128,32,32),P.restore();let ca=M.getContext("2d");ca.mozImageSmoothingEnabled=!1,ca.webkitImageSmoothingEnabled=!1,ca.msImageSmoothingEnabled=!1,ca.imageSmoothingEnabled=!1,ca.drawImage(N,0,0,540,540),U.map.forEach((da,ea)=>{da.forEach((fa,ga)=>{return 1===fa.type||0===U.shownmap[ea][ga]||void(ca.fillStyle=0===U.viewmap[ea][ga]?14===fa.spriteNo?"#633":"#555":14===fa.spriteNo?"#c99":"#aaa",ca.fillRect(340+2*ga,2*ea,2,2))})}),U.mapObjects.forEach((da)=>{return da.title&&"stair"===da.title?void(ca.fillStyle="#9cf",ca.fillRect(340+2*da.x,2*da.y,2,2)):!0}),ca.fillStyle="red",ca.fillRect(340+2*T.tilePos.x,2*T.tilePos.y,2,2),ca.fillStyle="white",ca.fillText(_Mathround(1/aa)+"fps",500,20),J.render(ca),requestAnimationFrame(u)}const z=n(1),A=n(2),B=n(3),C=n(5),D=n(9),E=n(10),F=n(4),G=n(11),H=n(13),I=n(7),J=n(12),K=n(8);I.add("door","./sounds/door.mp3"),I.add("footstep1","./sounds/footstep1.mp3");let L=document.querySelector.bind(document),M=document.createElement("canvas");M.width=540,M.height=540;let N=document.createElement("canvas");N.width=270,N.height=270;let O=document.createElement("canvas");O.width=270,O.height=270,L("#container").appendChild(M);let P=N.getContext("2d"),R=new G;R.on();let T=new B,U=null,W=[],X=new K(512,512,["shader-stage-fs","shader-stage-vs"]);for(let aa=1;20>aa;aa++)W.push(new H(100,100,"building",aa,{renderer:X}));U=W[0];let Y=0,Z,_;_=performance.now()/1e3,function(){T.tilePos={x:U.startPosition.x,y:U.startPosition.y},T.realPos={x:32*T.tilePos.x,y:32*T.tilePos.y},u(),J.add("Game Start!")}()},function(f){f.exports=class{constructor(q,u,z){this.img=q,this.tileWidth=u,this.tileHeight=z,this.columns=this.img.width/u,this.rows=this.img.height/z,this.canvas=document.createElement("canvas"),this.ctx=null,this.img.addEventListener&&this.img.addEventListener("load",()=>{this.columns=this.img.width/u,this.rows=this.img.height/z,this.canvas.width=q.width,this.canvas.height=q.height})}draw(q,u,z,A,B){if(0!=this.img.width||0!=this.img.height)if(null==B){let C=A%this.columns,D=_Mathfloor(A/this.columns);q.drawImage(this.img,C*this.tileWidth,D*this.tileHeight,this.tileWidth,this.tileHeight,u,z,this.tileWidth,this.tileHeight)}else q.drawImage(this.img,A*this.tileWidth,B*this.tileHeight,this.tileWidth,this.tileHeight,u,z,this.tileWidth,this.tileHeight)}}},function(f){f.exports=class{constructor(q,u,z,A){this.sheet=q,this.frames=u,this.duration=z,this.durationPerFrame=this.duration/this.frames.length,this.loop=A||!1,this.done=!1,this.elapsed=0,this.cur=0}update(q){if(!this.done){if(this.elapsed+=q,!this.loop&&this.elapsed>=this.duration)return this.cur=this.frames.length-1,void(this.done=!0);for(;this.elapsed>=this.durationPerFrame;)this.elapsed-=this.durationPerFrame,this.cur++;this.cur%=this.frames.length}}draw(q,u,z){this.sheet.draw(q,u,z,this.frames[this.cur])}}},function(f,k,n){const q=n(1),u=n(2),z=n(4),A=n(5),B=n(7),C=n(8);class D{constructor(){this.load=4,this.composite=document.createElement("canvas"),this.composite.width=320,this.composite.height=192,this.composite_light=document.createElement("canvas"),this.composite_light.width=320,this.composite_light.height=192,this.img=new Image,this.img.src="images/character.png",this.cloth=new Image,this.cloth.src="images/cloth1.png",this.lightmap=new Image,this.lightmap.src="images/character_lightmap.png",this.clothlight=new Image,this.clothlight.src="images/cloth1_light.png",this.inventorySize=20,this.loaded=!1;let E=()=>{this.load--,0>=this.load&&(this.composite.getContext("2d").drawImage(this.img,0,0),this.composite.getContext("2d").drawImage(this.cloth,0,0),this.composite_light.getContext("2d").drawImage(this.lightmap,0,0),this.composite_light.getContext("2d").drawImage(this.clothlight,0,0),this.sheet=new q(this.composite,32,48),this.lighsheet=new q(this.composite_light,32,48),this.animations={stand:[new u(this.sheet,[0,1,2,3],0.5,!0),new u(this.sheet,[10,11,12,13],0.5,!0),new u(this.sheet,[20,21,22,23],0.5,!0),new u(this.sheet,[30,31,32,33],0.5,!0)],walk:[new u(this.sheet,[0,4,5,4,0,6,7,6],0.5,!0),new u(this.sheet,[10,14,15,14,10,16,17,16],0.5,!0),new u(this.sheet,[20,25,24,25,20,27,26,27],0.5,!0),new u(this.sheet,[30,34,35,34,30,36,37,36],0.5,!0)]},this.animations_light={stand:[new u(this.lighsheet,[0,1,2,3],0.5,!0),new u(this.lighsheet,[10,11,12,13],0.5,!0),new u(this.lighsheet,[20,21,22,23],0.5,!0),new u(this.lighsheet,[30,31,32,33],0.5,!0)],walk:[new u(this.lighsheet,[0,4,5,4,0,6,7,6],0.5,!0),new u(this.lighsheet,[10,14,15,14,10,16,17,16],0.5,!0),new u(this.lighsheet,[20,25,24,25,20,27,26,27],0.5,!0),new u(this.lighsheet,[30,34,35,34,30,36,37,36],0.5,!0)]},this.loaded=!0)};this.img.addEventListener("load",E),this.cloth.addEventListener("load",E),this.lightmap.addEventListener("load",E),this.clothlight.addEventListener("load",E),this.dir=0,this.tilePos={x:5,y:5},this.realPos={x:160,y:160},this.state="stand",this.buff=document.createElement("canvas"),this.buff.width=32,this.buff.height=64,this.btx=this.buff.getContext("2d"),this.lightBuff=document.createElement("canvas"),this.lightBuff.width=32,this.lightBuff.height=64,this.ltx=this.lightBuff.getContext("2d"),this.tempBuff=document.createElement("canvas"),this.tempBuff.width=32,this.tempBuff.height=64,this.ttx=this.tempBuff.getContext("2d"),this.renderer=new C(32,64,["shader-fs","shader-vs"]),this.level=1,this.str=10,this.dex=10,this.int=10,this.sight=96,this.fullHp=10,this.hp=10,this.maxHungry=10,this.hungry=0,this.inventory=[]}setPos(E,F){this.tilePos={x:E,y:F},this.realPos={x:32*E,y:32*F}}have(E){return!!this.inventory.findIndex((F)=>F.type===E)}gotItem(){this.inventory.length>=this.inventorySize}use(){}get front(){switch(this.dir){case 2:return{x:this.tilePos.x-1,y:this.tilePos.y};case 1:return{x:this.tilePos.x+1,y:this.tilePos.y};case 0:return{x:this.tilePos.x,y:this.tilePos.y+1};case 3:return{x:this.tilePos.x,y:this.tilePos.y-1};}}update(E,F,G){if(this.loaded){if("stand"==this.state)if(F.isDown(37)||F.btnDown(14)||-0.5>F.axes.x)2==this.dir&&0<this.tilePos.x&&G.canMove(this.tilePos.x-1,this.tilePos.y)&&(this.tilePos.x--,this.state="walk",B.play("footstep1")),this.dir=2;else if(F.isDown(39)||F.btnDown(15)||0.5<F.axes.x)1==this.dir&&G.canMove(this.tilePos.x+1,this.tilePos.y)&&(this.tilePos.x++,this.state="walk",B.play("footstep1")),this.dir=1;else if(F.isDown(40)||F.btnDown(13)||0.5<F.axes.y)0==this.dir&&G.canMove(this.tilePos.x,this.tilePos.y+1)&&(this.tilePos.y++,this.state="walk",B.play("footstep1")),this.dir=0;else if(F.isDown(38)||F.btnDown(12)||-0.5>F.axes.y)3==this.dir&&0<this.tilePos.y&&G.canMove(this.tilePos.x,this.tilePos.y-1)&&(this.tilePos.y--,this.state="walk",B.play("footstep1")),this.dir=3;else if(F.isPress(13)||F.btnPress(0)){let K=this.front;G.do(this,K.x,K.y)}let H=this.tilePos.x*z.TILE_SIZE,I=this.tilePos.y*z.TILE_SIZE,J=128*E;_Mathabs(H-this.realPos.x)>=J?this.realPos.x+=J*(H>this.realPos.x?1:-1):this.realPos.x=H,_Mathabs(I-this.realPos.y)>=J?this.realPos.y+=J*(I>this.realPos.y?1:-1):this.realPos.y=I,this.realPos.x=_Mathround(this.realPos.x),this.realPos.y=_Mathround(this.realPos.y),this.realPos.x==H&&this.realPos.y==I&&"stand"!=this.state&&(G.reach(this),this.state="stand"),this.animations[this.state][this.dir].update(E),this.animations_light[this.state][this.dir].update(E)}}mult(E,F){E[0]+=F.r,E[1]+=F.g,E[2]+=F.b}render(E,F){if(!this.loaded)return;this.btx.clearRect(0,0,32,64),this.ltx.clearRect(0,0,32,64),this.ttx.clearRect(0,0,32,64),this.animations[this.state][this.dir].draw(this.btx,0,16),this.animations[this.state][this.dir].draw(this.ttx,0,16),this.animations_light[this.state][this.dir].draw(this.ltx,0,16);let G=F&&F.find((L)=>"function"==typeof L),H=[1,1,1],I=[1,1,1],J=[1,1,1],K=[1,1,1];F&&0<F.length&&(F=F.filter((L)=>A.distance(this.realPos.x,this.realPos.y,L.x,L.y)<L.brightness),F.forEach((L)=>{let M=L.x,N=L.y,O=_Mathround((180*(Math.atan2(N-this.realPos.y,M-this.realPos.x)/Math.PI)+270)%360/45)%8,P=0,Q=L.color.r,R=L.color.g,S=L.color.b,T=L.brightness,V=this.realPos.x,W=this.realPos.y,Z=1-A.distance(V,W,M,N)/T,_={r:Q*Z,g:R*Z,b:S*Z};0==O?(P=4,this.mult(K,_)):1==O?(P=12,this.mult(K,_),this.mult(I,_)):2==O?(P=8,this.mult(I,_)):3==O?(P=9,this.mult(H,_),this.mult(I,_)):4==O?(P=1,this.mult(H,_)):5==O?(P=3,this.mult(H,_),this.mult(J,_)):6==O?(P=2,this.mult(J,_)):7==O?(P=6,this.mult(K,_),this.mult(J,_)):void 0})),this.renderer.render(this.buff,this.lightBuff,G,[H,I,K,J]),E.drawImage(this.renderer.canvas,this.realPos.x,this.realPos.y-32)}}f.exports=D},function(f){f.exports={MIN_LEAF:10,MAX_LEAF:30,TILE_SIZE:32}},function(f,k,n){const q=n(6),u=n(4);f.exports={randomInt:function(A,B){return 0|Math.random()*(B-A)+A},createHall:function(A,B){if(0<=A.connected.findIndex((H)=>H.x==B.x&&H.y==B.y))return console.log("already connected"),null;let C=[],D={x:this.randomInt(1,A.w-2)+A.x,y:this.randomInt(1,A.h-2)+A.y},E={x:this.randomInt(1,B.w-2)+B.x,y:this.randomInt(1,B.h-2)+B.y},F=E.x-D.x,G=E.y-D.y;return A.connected.push(B),B.connected.push(A),0>F?0>G?0.5>Math.random()?(C.push({x:E.x,y:D.y,w:_Mathabs(F),h:1}),C.push({x:E.x,y:E.y,w:1,h:_Mathabs(G)+1})):(C.push({x:E.x,y:E.y,w:_Mathabs(F),h:1}),C.push({x:D.x,y:E.y,w:1,h:_Mathabs(G)+1})):0<G?0.5>Math.random()?(C.push({x:E.x,y:D.y,w:_Mathabs(F),h:1}),C.push({x:E.x,y:D.y,w:1,h:_Mathabs(G)+1})):(C.push({x:E.x,y:E.y,w:_Mathabs(F),h:1}),C.push({x:D.x,y:D.y,w:1,h:_Mathabs(G)+1})):C.push({x:E.x,y:E.y,w:_Mathabs(F),h:1}):0<F?0>G?0.5>Math.random()?(C.push({x:D.x,y:E.y,w:_Mathabs(F),h:1}),C.push({x:D.x,y:E.y,w:1,h:_Mathabs(G)})):(C.push({x:D.x,y:D.y,w:_Mathabs(F),h:1}),C.push({x:E.x,y:E.y,w:1,h:_Mathabs(G)})):0<G?0.5>Math.random()?(C.push({x:D.x,y:D.y,w:_Mathabs(F),h:2}),C.push({x:E.x,y:D.y,w:2,h:_Mathabs(G)})):(C.push({x:D.x,y:E.y,w:_Mathabs(F),h:1}),C.push({x:D.x,y:D.y,w:1,h:_Mathabs(G)})):C.push({x:D.x,y:D.y,w:_Mathabs(F),h:1}):0>G?C.push({x:E.x,y:E.y,w:1,h:_Mathabs(G)}):C.push({x:D.x,y:D.y,w:1,h:_Mathabs(G)}),C},getPoint:function(A,B,C){return{x:A.x+C*Math.cos(B),y:A.y+C*Math.sin(B)}},initArray:function(A,B,C){let D=[];for(let E=0;E<B;E++){D.push([]);for(let F=0;F<A;F++)D[E].push(C)}return D},distance:function(A,B,C,D){return _Mathsqrt(_Mathpow(C-A,2)+_Mathpow(D-B,2))},raycasting:function(A,B,C,D){let E={x:A.x+u.TILE_SIZE/2,y:A.y+u.TILE_SIZE/2},F=0;for(let G=0;G<C;G+=5){let H=this.getPoint(E,B,G),I=_Mathfloor(H.x/u.TILE_SIZE),J=_Mathfloor(H.y/u.TILE_SIZE);if(F=1-G/C,!D.canSeeThrough(I,J))return D.view(I,J,F),void D.see(I,J);D.view(I,J,F),D.see(I,J)}}}},function(f){f.exports=class{constructor(q,u,z,A){this.type=q,this.canSeeThrough=u||!1,this.canMove=z||!1,this.spriteNo=A}set(q,u,z,A){this.type=q,this.canSeeThrough=u||!1,this.canMove=z||!1,this.spriteNo=A||this.spriteNo}}},function(f){class n{constructor(){this.sounds={}}add(q,u){if(!this.sounds[q]){let z=new Audio(u);this.sounds[q]=z}}play(q){this.sounds[q]&&(this.sounds[q].pause(),this.sounds[q].currentTime=0,this.sounds[q].play())}}n.instance=null,n.getInstance=function(){return null===this.instance&&(this.instance=new n),this.instance},f.exports=n.getInstance()},function(f){function n(u,z){let A=document.querySelector("#"+z),B=A.textContent,C=null;switch(A.type){case"x-shader/x-fragment":C=u.createShader(u.FRAGMENT_SHADER);break;case"x-shader/x-vertex":C=u.createShader(u.VERTEX_SHADER);}return C?(u.shaderSource(C,B),u.compileShader(C),C):null}f.exports=class{constructor(u,z,A){this.canvas=document.createElement("canvas"),this.canvas.width=u,this.canvas.height=z;let B=this.canvas.getContext("webgl")||this.canvas.getContext("experimental-webgl");this.gl=B,B.viewport(0,0,this.canvas.width,this.canvas.height),B.enable(B.DEPTH_TEST);let C=A.map((R)=>n(B,R)),D=B.createProgram();this.shaderProgram=D,C.forEach((R)=>B.attachShader(this.shaderProgram,R)),B.linkProgram(this.shaderProgram),B.useProgram(this.shaderProgram),D.vertexPositionAttribute=B.getAttribLocation(D,"aVertexPosition"),B.enableVertexAttribArray(D.vertexPositionAttribute),D.textureCoordAttribute=B.getAttribLocation(D,"aTextureCoord"),B.enableVertexAttribArray(D.textureCoordAttribute),D.vertexNormalAttribute=B.getAttribLocation(D,"aVertexNormal"),0<=D.vertexNormalAttribute&&B.enableVertexAttribArray(D.vertexNormalAttribute),D.pMatrixUniform=B.getUniformLocation(D,"uPMatrix"),D.mvMatrixUniform=B.getUniformLocation(D,"uMVMatrix"),D.mNormalUniform=B.getUniformLocation(D,"uNormalMatrix"),D.samplerUniform=B.getUniformLocation(D,"uSampler");let E=mat4.create(),F=mat4.create(),G=B.createBuffer();B.bindBuffer(B.ARRAY_BUFFER,G);B.bufferData(B.ARRAY_BUFFER,new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),B.STATIC_DRAW),G.itemSize=3,G.numItems=4;let J=B.createBuffer();B.bindBuffer(B.ARRAY_BUFFER,J);B.bufferData(B.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1]),B.STATIC_DRAW),J.itemSize=3,J.numItems=4;let L=B.createBuffer();B.bindBuffer(B.ARRAY_BUFFER,L);B.bufferData(B.ARRAY_BUFFER,new Float32Array([0,0,1,0,1,1,0,1]),B.STATIC_DRAW),L.itemSize=2,L.numItems=4;let N=B.createBuffer();B.bindBuffer(B.ELEMENT_ARRAY_BUFFER,N);B.bufferData(B.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),B.STATIC_DRAW),N.itemSize=1,N.numItems=6;let P=B.createTexture(),Q=B.createTexture();this.o={texture:P,lightTexture:Q,vertexPositionBuffers:G,vertexNormalBuffers:J,mvMatrix:E,pMatrix:F,coordBuffer:L,indexBuffer:N}}updateTexture(u,z,A){u.bindTexture(u.TEXTURE_2D,A),u.pixelStorei(u.UNPACK_FLIP_Y_WEBGL,!0),u.texImage2D(u.TEXTURE_2D,0,u.RGBA,u.RGBA,u.UNSIGNED_BYTE,z),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MAG_FILTER,u.NEAREST),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MIN_FILTER,u.NEAREST),u.bindTexture(u.TEXTURE_2D,null)}render(u,z,A,B,C){let D=this.gl;if(this.updateTexture(D,u,this.o.texture),z&&this.updateTexture(D,z,this.o.lightTexture),D.viewport(0,0,this.canvas.width,this.canvas.height),D.clear(D.COLOR_BUFFER_BIT|D.DEPTH_BUFFER_BIT),D.bindBuffer(D.ARRAY_BUFFER,this.o.vertexPositionBuffers),D.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,this.o.vertexPositionBuffers.itemSize,D.FLOAT,!1,0,0),D.bindBuffer(D.ARRAY_BUFFER,this.o.coordBuffer),D.vertexAttribPointer(this.shaderProgram.textureCoordAttribute,this.o.coordBuffer.itemSize,D.FLOAT,!1,0,0),0<=this.shaderProgram.vertexNormalAttribute&&(D.bindBuffer(D.ARRAY_BUFFER,this.o.vertexNormalBuffers),D.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute,this.o.vertexNormalBuffers.itemSize,D.FLOAT,!1,0,0)),D.activeTexture(D.TEXTURE0),D.bindTexture(D.TEXTURE_2D,this.o.texture),D.uniform1i(D.getUniformLocation(this.shaderProgram,"uSampler"),0),D.activeTexture(D.TEXTURE1),D.bindTexture(D.TEXTURE_2D,this.o.lightTexture),D.uniform1i(D.getUniformLocation(this.shaderProgram,"normalMap"),1),0<B.length&&D.uniform3f(D.getUniformLocation(this.shaderProgram,"topC"),B[0][0],B[0][1],B[0][2]),1<B.length&&D.uniform3f(D.getUniformLocation(this.shaderProgram,"leftC"),B[1][0],B[1][1],B[1][2]),2<B.length&&D.uniform3f(D.getUniformLocation(this.shaderProgram,"bottomC"),B[2][0],B[2][1],B[2][2]),3<B.length&&D.uniform3f(D.getUniformLocation(this.shaderProgram,"rightC"),B[3][0],B[3][1],B[3][2]),A&&D.uniform3f(D.getUniformLocation(this.shaderProgram,"ambientLight"),A.color.r,A.color.g,A.color.b),C){let F=[],G=[];C.forEach((H)=>{F.push(H.x,H.y),G.push(H.color.r,H.color.g,H.color.b,H.brightness)}),0<F.length&&(D.uniform2fv(D.getUniformLocation(this.shaderProgram,"lightPositions"),F),D.uniform4fv(D.getUniformLocation(this.shaderProgram,"lightColors"),G))}D.bindBuffer(D.ELEMENT_ARRAY_BUFFER,this.o.indexBuffer),D.uniformMatrix4fv(this.shaderProgram.pMatrixUniform,!1,this.o.pMatrix),D.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform,!1,this.o.mvMatrix);let E=mat3.create();mat4.toInverseMat3(this.o.mvMatrix,E),mat4.toInverseMat3(this.o.mvMatrix,E),mat3.transpose(E),D.uniformMatrix3fv(this.shaderProgram.mNormalUniform,!1,E),D.useProgram(this.shaderProgram),D.drawElements(D.TRIANGLES,this.o.indexBuffer.numItems,D.UNSIGNED_SHORT,0),D.deleteProgram(this.shaderProgram)}}},function(f){"use strict";f.exports={ambientLight:function(n){let q=n,u=q.r,z=q.g,A=q.b,B=function(C){let G,D=C.getImageData(0,0,C.canvas.width,C.canvas.height),E=D.data,F=D.data.length;for(G=0;G<F;G+=4)(0!==E[G]||0!==E[G+1]||0!==E[G+2])&&(E[G]*=u,E[G+1]=E[G+1]*z,E[G+2]=E[G+2]*A);C.putImageData(D,0,0)};return B.color=q,B},spotLight:function(n,q){let u=q.color,z=u.r,A=u.g,B=u.b,C=q.x,D=q.y,E=q.brightness,F=0,G=n.getImageData(0,0,n.canvas.width,n.canvas.height),H=G.data,I=G.width,J=G.height,K,L,M,N,O;for(L=0;L<J;L++)for(N=4*(L*I),K=0;K<I;K++)F=_Mathsqrt(_Mathpow(C-K,2)+_Mathpow(D-L,2)),F>E||(O=1-F/E,M=N+4*K,(0!==H[M]||0!==H[M+1]||0!==H[M+2])&&(H[M]+=255*z*O,H[M+1]+=255*A*O,H[M+2]+=255*B*O));n.putImageData(G,0,0)}}},function(f,k,n){const q=n(4),u=n(5);class z{constructor(A,B,C,D){this.x=A,this.y=B,this.w=C,this.h=D,this.left=null,this.right=null,this.room=null,this.halls=[]}split(){let B,C,A=!1;return this.left||this.right?!1:(A=0.5<Math.random(),this.w>this.h&&1.25<=this.w/this.h?A=0:this.h>this.w&&1.25<=this.h/this.w&&(A=1),B=(A?this.h:this.w)-q.MIN_LEAF,!(B<q.MIN_LEAF))&&(C=_Mathfloor(Math.random()*(B-q.MIN_LEAF)+q.MIN_LEAF),A?(this.left=new z(this.x,this.y,this.w,C),this.right=new z(this.x,this.y+C,this.w,this.h-C)):(this.left=new z(this.x,this.y,C,this.h),this.right=new z(this.x+C,this.y,this.w-C,this.h)),!0)}createRooms(){if(!(this.left||this.right)){let A=u.randomInt(3,this.w-2),B=u.randomInt(3,this.h-2),C=u.randomInt(1,this.w-A-2)+this.x,D=u.randomInt(1,this.h-B-2)+this.y;this.room={x:C,y:D,w:A,h:B,connected:[]}}else if(this.left&&this.left.createRooms(),this.right&&this.right.createRooms(),this.left&&this.right){let A=u.createHall(this.left.getRoom(),this.right.getRoom());A&&this.halls.push(A)}}getRoom(){return this.room?this.room:this.left||this.right?this.right?this.left?.5<Math.random()?this.left.getRoom():this.right.getRoom():this.right.getRoom():this.left.getRoom():null}}f.exports=z},function(f,k,n){const q=n(12);f.exports=class{constructor(){this.keys=[],this.lastKeys=[],this.down=[],this.up=[],this.keydown=this.keyDownHandlerCallback.bind(this),this.keyup=this.keyUpHandlerCallback.bind(this),this.padConnect=this.gamepadConnectCallback.bind(this),this.padDisconnect=this.gamepadDisconnectCallback.bind(this),this.gamePads=[],this.buttons=[],this.lastButtons=[],this.axes={x:0,y:0}}on(){document.addEventListener("keydown",this.keydown,!1),document.addEventListener("keyup",this.keyup,!1),window.addEventListener("gamepadconnected",this.padConnect),window.addEventListener("gamepaddisconnected",this.padConnect)}off(){document.removeEventListener("keydown",this.keydown),document.removeEventListener("keyup",this.keyup)}gamepadConnectCallback(z){q.add("Gamepad "+z.gamepad.index+" Connected!"),this.gamePads[z.gamepad.index]=z.gamepad}gamepadDisconnectCallback(z){q.add("Gamepad "+z.gamepad.index+" disconnected!"),delete this.gamePads[z.gamepad.index]}keyDownHandlerCallback(z){this.down.push(z.keyCode)}keyUpHandlerCallback(z){this.up.push(z.keyCode)}update(){let z=navigator.getGamepads?navigator.getGamepads():navigator.webkitGetGamepads?navigator.webkitGetGamepads():[];for(this.lastKeys=this.keys.slice();0<this.down.length;)this.keys[this.down.pop()]=!0;for(;0<this.up.length;)this.keys[this.up.pop()]=!1;this.lastButtons=this.buttons.slice(),z[0]&&(this.buttons=z[0].buttons.map((A)=>A.pressed),this.axes.x=z[0].axes[0],this.axes.y=z[0].axes[1])}btnPress(z){return this.buttons[z]&&!this.lastButtons[z]}btnDown(z){return this.buttons[z]}btnRelease(z){return!this.buttons[z]&&this.lastButtons[z]}isPress(z){return this.keys[z]&&!this.lastKeys[z]}isDown(z){return this.keys[z]}isUp(z){return!this.keys[z]}isRelease(z){return!this.keys[z]&&this.lastKeys[z]}}},function(f){class n{constructor(u,z){this.msg=u,this.color=z,null==z&&(this.color="red"),this.done=!1,this.elapsed=0}update(u){this.done||(this.elapsed+=u,3<this.elapsed&&(this.done=!0))}render(u,z){u.save(),u.font="16px verdana";let A=_Mathmax(u.measureText(this.msg).width,130)+50,B=0.5>this.elapsed?this.elapsed/0.5*A:(1-(this.elapsed-2.5)/0.5)*A;0.5<this.elapsed&&2.5>this.elapsed&&(B=A),B=u.canvas.width-B,u.translate(B,z),u.fillStyle="rgba(0,0,0,0.9)",u.fillRect(0,0,A,50),u.fillStyle=this.color,u.fillRect(0,0,10,50),u.fillStyle="white",u.fillText(this.msg,20,33),u.restore()}}class q{constructor(){this.toasts=[]}add(u,z){this.toasts.push(new n(u,z))}update(u){this.toasts.forEach((z)=>z.update(u)),this.toasts=this.toasts.filter((z)=>!z.done)}render(u){let z=u.canvas.height;this.toasts.forEach((A,B)=>{A.render(u,z-60*(B+1))})}}q.instance=null,q.getInstance=function(){return null===q.instance&&(q.instance=new q),q.instance},f.exports=q.getInstance()},function(f,k,n){const q=n(5),u=n(1),z=n(4),A=n(6),B=n(10),C=n(9),D=n(14),E=n(15),F=n(8),G={building:"images/tileset.png"};f.exports=class{constructor(I,J,K,L,M){this.depth=L||1,this.width=I,this.height=J,this.lights=[],this.monsters=[],this.mapObjects=[],this.items=[],this.ambient=C.ambientLight({r:_Mathmin(0.3+Math.random(),0.8),g:_Mathmin(0.3+Math.random(),0.8),b:_Mathmin(Math.random()+0.3,1),a:1}),this.tileset=new Image,this.tileset.src=G[K],this.layers=[],this.buffers=[document.createElement("canvas"),document.createElement("canvas")],this.buffers.forEach((O)=>{O.width=512,O.height=512}),this.objectBuffers=[document.createElement("canvas"),document.createElement("canvas")],this.objectBuffers.forEach((O)=>{O.width=128,O.height=128}),this.mapRenderer=M.renderer||new F(512,512,["shader-stage-fs","shader-stage-vs"]),this.sheet=new u(this.tileset,32,32),this.map=q.initArray(I,J,null),this.mapTop=q.initArray(I,J,null);let N=E(I,J,this.sheet,50,L);this.map=N.map,this.startPosition=N.startPosition,this.downPosition=N.downPosition,this.lights.push.apply(this.lights,N.lights),this.mapObjects.push.apply(this.mapObjects,N.doors);for(let O=0;O<this.width;O++)for(let P=0;P<this.height;P++)null==this.map[P][O]?this.map[P][O]=P<J-1&&null!==this.map[P+1][O]&&0===this.map[P+1][O].type?new A(1,!1,!1,4):new A(1,!1,!1,17):P<this.height-1&&1==this.map[P][O].type&&this.map[P+1][O]&&0==this.map[P+1][O].type&&(this.map[P][O].spriteNo=4);for(let O=0;O<this.width;O++)for(let P=0;P<this.height;P++)0<O&&O<this.width-1&&1==this.map[P][O].type&&0==this.map[P][O-1].type&&0==this.map[P][O+1].type?this.mapTop[P-1][O]=0<P&&0==this.map[P-1][O].type?new A(1,!1,!1,9):new A(1,!1,!1,19):0<O&&1==this.map[P][O].type&&0==this.map[P][O-1].type?this.mapTop[P-1][O]=0<P&&0==this.map[P-1][O].type?new A(1,!1,!1,6):new A(1,!1,!1,16):O<this.width-1&&1==this.map[P][O].type&&0==this.map[P][O+1].type?this.mapTop[P-1][O]=0<P&&0==this.map[P-1][O].type?new A(1,!1,!1,8):new A(1,!1,!1,18):0<P&&1==this.map[P][O].type&&0==this.map[P-1][O].type&&(this.mapTop[P-1][O]=new A(1,!1,!1,7));this.layers.push(this.map),this.viewmap=q.initArray(I,J,0),this.shownmap=q.initArray(I,J,0),this.tileset.addEventListener("load",()=>{this.makeBuffer()}),this.eventQueue=[]}canMove(I,J){let K=0<=I&&0<=J&&I<this.width&&J<this.height&&this.map[J][I].canMove;return this.monsters.forEach((L)=>{K=K&&L.x!=I&&L.y!=J}),this.mapObjects.forEach((L)=>{L.x===I&&L.y===J&&(K=K&&L.canMove)}),K}canSeeThrough(I,J){let K=0<=I&&0<=J&&I<this.width&&J<this.height&&this.map[J][I].canSeeThrough;return this.mapObjects.forEach((L)=>{L.x==I&&L.y==J&&(K=K&&L.canSeeThrough)}),K}see(I,J){0<=I&&0<=J&&I<this.width&&J<this.height&&(this.shownmap[J][I]=1)}view(I,J,K){0<=I&&0<=J&&I<this.width&&J<this.height&&(this.viewmap[J][I]=_Mathmax(K,this.viewmap[J][I]))}update(I,J){this.monsters.forEach((K)=>K.update(I,this.map,J)),this.mapObjects.forEach((K)=>{K.update&&K.update(I,J)}),this.viewmap=q.initArray(this.width,this.height,0);for(let K=0;360>K;K+=5)q.raycasting(J.realPos,K,J.sight,this)}getObject(I,J){let K=[];return Array.prototype.push.call(K,this.monsters.filter((L)=>L.x==I&&L.y==J)),Array.prototype.push.call(K,this.items.filter((L)=>L.x==I&&L.y==J)),Array.prototype.push.call(K,this.mapObjects.filter((L)=>L.x==I&&L.y==J)),K}draw(I,J){I.drawImage(this.buffers[J],0,0)}reach(I){this.mapObjects.forEach((J)=>{J.x==I.tilePos.x&&J.y==I.tilePos.y&&J.reach&&this.eventQueue.push(J.reach(I))})}do(I,J,K){this.items.forEach((L)=>{L.x==J&&L.y==K&&L.do(I)}),this.monsters.forEach((L)=>{L.x==J&&L.y==K&&L.do(I)}),this.mapObjects.forEach((L)=>{L.x==J&&L.y==K&&L.do(I)})}makeBuffer(){}render(I,J,K){let L,M,N=_Mathfloor(J/z.TILE_SIZE)-4,O=_Mathfloor(K/z.TILE_SIZE)-4,P=J%z.TILE_SIZE,Q=K%z.TILE_SIZE,R=J-4*z.TILE_SIZE,S=J+5*z.TILE_SIZE,T=K-4*z.TILE_SIZE,U=K+5*z.TILE_SIZE,V=this.buffers[0].getContext("2d"),W=this.buffers[1].getContext("2d");V.clearRect(0,0,V.canvas.width,V.canvas.height),W.clearRect(0,0,W.canvas.width,W.canvas.height);let X=this.objectBuffers[0].getContext("2d"),Y=this.objectBuffers[1].getContext("2d");for(L=N;L<N+10;L++)if(!(0>L||L>this.width))for(M=O;M<O+10;M++)0>M||M>this.width||(X.clearRect(0,0,X.canvas.width,X.canvas.height),Y.clearRect(0,0,Y.canvas.width,Y.canvas.height),this.sheet.draw(X,0,0,this.map[M][L].spriteNo),V.drawImage(this.objectBuffers[0],L*z.TILE_SIZE-R,M*z.TILE_SIZE-T),this.mapTop[M][L]&&(this.sheet.draw(Y,0,0,this.mapTop[M][L].spriteNo),W.drawImage(this.objectBuffers[1],L*z.TILE_SIZE-R,M*z.TILE_SIZE-T)));let Z=this.height*z.TILE_SIZE,_=this.lights.map((aa)=>{return{x:(aa.x-R)/512,y:1-(aa.y-T)/512,color:aa.color,brightness:aa.brightness/z.TILE_SIZE}});for(this.mapObjects.forEach((aa)=>{return 0===this.shownmap[aa.y][aa.x]||void aa.render(V,W,R,T)}),this.mapRenderer.render(this.buffers[0],null,this.ambient,[],_),V.drawImage(this.mapRenderer.canvas,0,0),this.mapRenderer.render(this.buffers[1],null,this.ambient,[],[]),W.drawImage(this.mapRenderer.canvas,0,0),V.fillStyle="black",W.fillStyle="black",M=0;11>M;M++)for(L=0;11>L;L++)0>M+O||0>L+N||L+N>=this.width||M+O>=this.height||(this.shownmap[M+O][L+N]||(V.fillRect(L*z.TILE_SIZE-P,M*z.TILE_SIZE-Q,z.TILE_SIZE,z.TILE_SIZE),W.fillRect(L*z.TILE_SIZE-P,(M-1)*z.TILE_SIZE-Q,z.TILE_SIZE,z.TILE_SIZE)),this.sheet.draw(W,L*z.TILE_SIZE-P,M*z.TILE_SIZE-Q,10*_Mathround(8*this.viewmap[M+O][L+N]+3)))}}},function(f,k,n){const q=n(4),u=n(7),z=n(12);f.exports=class{constructor(B,C,D,E,F){this.dir=B,this.x=D,this.y=E,this.sheet=C,this.opened=!1,this.canSeeThrough=!1,this.canMove=!1,this.type="mapobject",this.openTimer=0,this.locked=F||null,this.openSound="door",this.title="door"}update(B){0<this.openTimer&&(this.openTimer-=B,0>this.openTimer&&(this.openTimer=0))}render(B,C,D,E){let F=this.x*q.TILE_SIZE-D,G=this.y*q.TILE_SIZE-E,H=this.opened?0<this.openTimer?70:50:30;0===this.dir?(this.sheet.draw(C,F,G-q.TILE_SIZE,H+1),this.sheet.draw(B,F,G,H+11)):(this.sheet.draw(C,F,G-q.TILE_SIZE,H+3),this.sheet.draw(B,F,G,H+13),this.sheet.draw(C,F+q.TILE_SIZE,G-q.TILE_SIZE,H+4),this.sheet.draw(B,F+q.TILE_SIZE,G,H+14))}do(B){if(this.locked)if(B.have(this.locked))B.use(this.locked),this.locked=null;else return void z.add("Door is locked");this.opened=!0,this.canSeeThrough=!0,this.canMove=!0,this.openTimer=0.2,u.play(this.openSound)}}},function(f,k,n){function q(S,T){return _Mathfloor(S-T/2)}function u(S,T){return _Mathfloor(S+(T+1)/2)}function z(S,T){return _Mathfloor(S+(T-1)/2)}function A(S,T,U,V,W,X,Y){let Z=q,_=z;switch(Y){case P.NORTH:return W===Z(S,U)||W===_(S,U)||X===T||X===T-V+1;break;case P.EAST:return W===S||W===S+U-1||X===Z(T,V)||X===_(T,V);break;case P.SOUTH:return W===Z(S,U)||W===_(S,U)||X===T||X===T+V-1;break;case P.WEST:return W===S||W===S-U+1||X===Z(T,V)||X===_(T,V);}throw new Error("Invalid operation")}function B(S,T,U,V,W){let X=q,Y=u,Z=[];switch(W){case P.NORTH:for(let _=0|X(S,U);_<Y(S,U);_++)for(let aa=T;aa>T-V;aa--)Z.push({x:_,y:aa});break;case P.EAST:for(let _=S;_<S+U;_++)for(let aa=0|X(T,V);aa<Y(T,V);aa++)Z.push({x:_,y:aa});break;case P.SOUTH:for(let _=0|X(S,U);_<Y(S,U);_++)for(let aa=T;aa<T+V;aa++)Z.push({x:_,y:aa});break;case P.WEST:for(let _=S;_>S-U;_--)for(let aa=0|X(T,V);aa<Y(T,V);aa++)Z.push({x:_,y:aa});}return Z}function C(S,T,U,V,W,X){let Y=L.randomInt(5,U),Z=L.randomInt(5,V),_=B(S,T,Y,Z,W);return!_.some((aa)=>0>aa.y||aa.y>=X.length||0>aa.x||aa.x>=X[0].length||!J(X,aa.x,aa.y))&&(_.forEach((aa)=>{let ba=null;ba=A(S,T,Y,Z,aa.x,aa.y,W)?new M(1,!1,!1,17):new M(0,!0,!0,14),X[aa.y][aa.x]=ba}),!0)}function D(S,T,U,V,W,X,Y){let Z=L.randomInt(2,W),_,aa=0;switch(X){case P.NORTH:if(0>S||S>U)return!1;for(_=S,aa=T;aa>T-Z;aa--){if(0>aa||aa>V)return!1;if(!J(Y,_,aa))return!1}for(aa=T;aa>T-Z;aa--)Y[aa][_]=new M(0,!0,!0,13);break;case P.EAST:if(0>T||T>V)return!1;for(aa=T,_=S;_<S+Z;_++){if(0>_||_>U)return!1;if(!J(Y,_,aa))return!1}for(_=S;_<S+Z;_++)Y[aa][_]=new M(0,!0,!0,13);break;case P.SOUTH:if(0>S||S>U)return!1;for(_=S,aa=T;aa<T+Z;aa++){if(0>aa||aa>V)return!1;if(!J(Y,_,aa))return!1}for(aa=T;aa<T+Z;aa++)Y[aa][_]=new M(0,!0,!0,13);break;case P.WEST:if(0>aa||aa>V)return!1;for(aa=T,_=S;_>S-Z;_--){if(0>_||_>U)return!1;if(!J(Y,_,aa))return!1}for(_=S;_>S-Z;_--)Y[aa][_]=new M(0,!0,!0,13);}return!0}function F(S,T,U,V){return 0<S&&S<U&&0<T&&T<V}function G(S,T,U,V,W){let X=H(S,T,U,V);return X.map((Y)=>{return{x:Y.x,y:Y.y,dir:Y.dir,tile:W[Y.y][Y.x]}})}function H(S,T,U,V){let W=[{x:S,y:T+1,dir:P.NORTH},{x:S-1,y:T,dir:P.EAST},{x:S,y:T-1,dir:P.SOUTH},{x:S+1,y:T,dir:P.WEST}];return W.filter((X)=>F(X.x,X.y,U,V))}function I(S,T,U,V){return 0>V||V>=S.length?null:0>U||U>=S[0].length?null:S[V][U]?S[V][U][T]:null}function J(S,T,U){return 0>U||U>=S.length?!1:0>T||T>=S.length?!1:!(null!==S[U][T])}const L=n(5),M=n(6),N=n(14),O=n(16),P={EAST:2,WEST:1,NORTH:3,SOUTH:0};let R=0;f.exports=function(S,T,U,V,W){R=1>V?10:V;let X=[],Y=[],Z=L.initArray(S,T,null),_=L.randomInt(0,4);C(0|S/2,0|T/2,8,6,_,Z);let aa={x:0|S/2,y:0|T/2},ba={x:0|S/2,y:0|T/2};_===P.NORTH?aa.y--:_===P.EAST?aa.x++:_===P.SOUTH?aa.y++:_===P.WEST?aa.x--:void 0;let ca=1;for(let da=0;1e3>da&&!(ca==R);da++){let ja,ea=0,fa=0,ga=0,ha=0,ia=null;for(let ka=0;1e3>ka;ka++)if(ea=L.randomInt(1,S-1),ga=L.randomInt(1,T-1),ja=null,Z[ga][ea]&&(13==Z[ga][ea].spriteNo||17==Z[ga][ea].spriteNo)){let la=G(ea,ga,S,T,Z);if(ja=la.find((ma)=>null!==ma&&ma.tile&&ma.tile.canMove),null==ja)continue;switch(ia=ja.dir,ia){case P.NORTH:ha=-1,fa=0;break;case P.EAST:fa=1,ha=0;break;case P.SOUTH:fa=0,ha=1;break;case P.WEST:fa=-1,ha=0;break;default:throw new Error("Invalid operation");}if(X.some((ma)=>ma.x===ea&&ma.y===ga+1||ma.x===ea-1&&ma.y===ga||ma.x===ea&&ma.y===ga-1||ma.x===ea+1&&ma.y===ga)&&(ia=null),null!=ia)break}if(ia){let ka=L.randomInt(0,100);if(!(75>=ka))75<ka&&D(ea+fa,ga+ha,S,T,6,ia,Z)&&(ca++,Z[ga][ea]=new M(0,!0,!0,13));else if(C(ea+fa,ga+ha,8,6,ia,Z)){ca++,Z[ga][ea]=new M(0,!0,!0,13),Z[ga+ha][ea+fa]=new M(0,!0,!0,14);let la=null;la=ia===P.EAST||ia===P.WEST?new N(1,U,ea,ga,null):new N(0,U,ea,ga,null),X.push(la),Y.push({x:32*(ea+fa)+16,y:32*(ga+ha)+16,color:{r:Math.random(),g:Math.random(),b:Math.random()},brightness:32*L.randomInt(3,6)})}}}for(;;)if(newx=L.randomInt(1,S-1),newy=L.randomInt(1,T-1),14===I(Z,"spriteNo",newx,newy)&&1!==I(Z,"type",newx,newy+1)&&!X.some((da)=>da.x===newx&&da.y===newy)){X.push(new O("down",U,newx,newy,50,50)),ba={x:newx,y:newy};break}if(1<W)for(;;)if(newx=L.randomInt(1,S-1),newy=L.randomInt(1,T-1),14===I(Z,"spriteNo",newx,newy)&&1!==I(Z,"type",newx,newy+1)&&!X.some((da)=>da.x===newx&&da.y===newy)){X.push(new O("up",U,newx,newy,50,50)),aa={x:newx,y:newy};break}return{map:Z,doors:X,lights:Y,downPosition:ba,startPosition:aa}}},function(f){f.exports=class{constructor(q,u,z,A,B,C){this.sheet=u,this.type=q,this.x=z,this.y=A,this.tarx=B,this.tary=C,this.canSeeThrough=!0,this.canMove=!0,this.title="stair"}reach(){return{command:"stair",dir:this.type}}do(){return null}render(q,u,z,A){switch(this.type){case"up":this.sheet.draw(q,32*this.x-z,32*this.y-A,24);break;case"down":this.sheet.draw(q,32*this.x-z,32*this.y-A,23);}}}}]);