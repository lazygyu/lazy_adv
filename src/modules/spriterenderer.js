/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {string} id 
 * @return {WebGLShader}
 */
function getShader(gl, id){
    let scr = document.querySelector("#" + id);
    let source = scr.textContent;
    let shader = null;
    switch(scr.type){
        case "x-shader/x-fragment":
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        break;
        case "x-shader/x-vertex":
            shader = gl.createShader(gl.VERTEX_SHADER);
        break;
    }

    if( !shader ) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}


class SpriteRenderer{
    constructor(width, height){
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        let gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        this.gl = gl;

        // webgl init
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.enable(gl.DEPTH_TEST);
        let fgShader = getShader(gl, "shader-fs");
        let vtShader = getShader(gl, "shader-vs");

        let shaderProgram = gl.createProgram();
        this.shaderProgram = shaderProgram;
        gl.attachShader(this.shaderProgram, fgShader);
        gl.attachShader(this.shaderProgram, vtShader);
        gl.linkProgram(this.shaderProgram);
        gl.useProgram(this.shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

        let mvMatrix = mat4.create();
        let pMatrix = mat4.create();
        let vertexPositionBuffers = gl.createBuffer();
        let ratio = width/height;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffers);

        let vertices = [
            -1.0,-1.0, 0.0,
             1.0,-1.0, 0.0,
             1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0
        ];
        //vertices = vertices.map((v,i)=>v*(i%3==0?ratio:1));
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        vertexPositionBuffers.itemSize = 3;
        vertexPositionBuffers.numItems = 4;

        let coordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, coordBuffer);
        let coordVert = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordVert), gl.STATIC_DRAW);
        coordBuffer.itemSize = 2;
        coordBuffer.numItems = 4;

        let indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        let indexes = [
            0, 1, 2, 0, 2, 3
        ];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), gl.STATIC_DRAW);
        indexBuffer.itemSize = 1;
        indexBuffer.numItems = 6;

        let texture = gl.createTexture();
        let lightTexture = gl.createTexture();
        this.o = {
            texture:texture,
            lightTexture:lightTexture,
            vertexPositionBuffers:vertexPositionBuffers,
            mvMatrix:mvMatrix,
            pMatrix:pMatrix,
            coordBuffer:coordBuffer,
            indexBuffer:indexBuffer
        };
    }

    updateTexture(gl, src, texture){
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    render(src, lightmap, ambient, lights){
        let gl = this.gl;
        this.updateTexture(gl, src, this.o.texture);
        this.updateTexture(gl, lightmap, this.o.lightTexture);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //mat4.perspective(180,this.canvas.width / this.canvas.height, 0.1, 100.0, this.o.pMatrix);
        //mat4.identity(this.o.mvMatrix);
        //mat4.translate(this.o.mvMatrix,[0.0, 0.0, -0.1]);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.o.vertexPositionBuffers);
        gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.o.vertexPositionBuffers.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.o.coordBuffer);
        gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.o.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);
 
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.o.texture);
        gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "uSampler"), 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.o.lightTexture);
        gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "normalMap"), 1);
        if( lights.length > 0 ) gl.uniform3f(gl.getUniformLocation(this.shaderProgram, "topC"), lights[0][0], lights[0][1], lights[0][2]);
        if( lights.length > 1 ) gl.uniform3f(gl.getUniformLocation(this.shaderProgram, "leftC"), lights[1][0], lights[1][1], lights[1][2]);
        if( lights.length > 2 ) gl.uniform3f(gl.getUniformLocation(this.shaderProgram, "bottomC"), lights[2][0], lights[2][1], lights[2][2]);
        if( lights.length > 3 ) gl.uniform3f(gl.getUniformLocation(this.shaderProgram, "rightC"), lights[3][0], lights[3][1], lights[3][2]);
        if( ambient ) gl.uniform3f(gl.getUniformLocation(this.shaderProgram, "ambientLight"), ambient.color.r, ambient.color.g, ambient.color.b);
        

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.o.indexBuffer);
        
        gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.o.pMatrix);
        gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.o.mvMatrix);
        gl.drawElements(gl.TRIANGLES, this.o.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        //gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.o.vertexPositionBuffers.numItems);
    }
}

module.exports = SpriteRenderer;