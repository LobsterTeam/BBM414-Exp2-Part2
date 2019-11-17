"use strict";
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// FIDAN SAMET 21727666
// OGUZ BAKIR 21627007
const triangleVertexNum = 12;
const triangleFanNumber = 360;
var ninjaStarData = [];
const gray = vec3(64 / 255.0, 64 / 255.0, 64 / 255.0);
const Sx = 0.5, Sy = 0.5, Sz = 0.5;
const xformMatrix = new Float32Array([
       Sx,   0.0,  0.0,  0.0,
       0.0,  Sy,   0.0,  0.0,
       0.0,  0.0,  Sz,   0.0,
       0.0,  0.0,  0.0,  1.0  
    ]);
const rotateAxis = [0, 0, 1];

window.onload = function init() {
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    
    gl.clearColor(250 / 255.0, 237 / 255.0, 51 / 255.0, 1.0);       // yellow
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    
    // DRAW TRIANGLES OF NINJA STAR
    ninjaStarTriangle(); 
    
    const triangleShader = initShaderProgram(gl, triangleVertexShader, triangleFragmentShader);
    const triangleBuffer = gl.createBuffer();
    gl.useProgram(triangleShader);
    
    // SCALING TRIANGLES

    var u_matrix = gl.getUniformLocation(triangleShader, 'u_matrix');
    gl.uniformMatrix4fv(u_matrix, false, xformMatrix);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ninjaStarData), gl.STATIC_DRAW);
    
    // TRIANGLE POSITIONS
    var numOfComponents = 2;        // x and y (2d)
    var offset = 0;
    gl.enableVertexAttribArray(gl.getAttribLocation(triangleShader, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(triangleShader, "a_position"),
            numOfComponents, type, normalize, stride, offset);
            
    // TRIANGLE COLORS
    numOfComponents = 3;
    offset = triangleVertexNum * 2 * 4;     // each vertex has 2 components
    gl.enableVertexAttribArray(gl.getAttribLocation(triangleShader, "a_color"));
    gl.vertexAttribPointer(gl.getAttribLocation(triangleShader, "a_color"),
            numOfComponents, type, normalize, stride, offset);
        
    // DRAW TRIANGLES
    offset = 0;
    gl.drawArrays(gl.TRIANGLES, offset, triangleVertexNum);

    // DRAW CIRCLES OF NINJA STAR
    offset = ninjaStarData.length * 4;
    ninjaStarCircle();
    numOfComponents = 2;
    const circleShader = initShaderProgram(gl, circleVertexShader, circleFragmentShader);
    var circleBuffer = gl.createBuffer();
    gl.useProgram(circleShader);
    
    // SCALING CIRCLES
    var u_matrix = gl.getUniformLocation(circleShader, 'u_matrix');
    gl.uniformMatrix4fv(u_matrix, false, xformMatrix);
       
    gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ninjaStarData), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(gl.getAttribLocation(circleShader, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(circleShader, "a_position"),
            numOfComponents, type, normalize, stride, offset);
    
    for (var i = 0; i < 5; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, i * triangleFanNumber + i, triangleFanNumber);
    }
}

function ninjaStarTriangle() {
    var circlePositions = [
        vec2(-1, 1),
        vec2(1 / 3, 1 / 3),
        vec2(-1 / 3, -1 / 3)
    ];
    ninjaStarData = ninjaStarData.concat(circlePositions[0], circlePositions[1], circlePositions[2]);

    var circlePositions = [
        vec2(-1, -1),
        vec2(-1 / 3, 1 / 3),
        vec2(1 / 3, -1 / 3)
    ];
    ninjaStarData = ninjaStarData.concat(circlePositions[0], circlePositions[1], circlePositions[2]);

    var circlePositions = [
        vec2(1, -1),
        vec2(1 / 3, 1 / 3),
        vec2(-1 / 3, -1 / 3)
    ];
    ninjaStarData = ninjaStarData.concat(circlePositions[0], circlePositions[1], circlePositions[2]);

    var circlePositions = [
        vec2(1, 1),
        vec2(-1 / 3, 1 / 3),
        vec2(1 / 3, -1 / 3)
    ];
    ninjaStarData = ninjaStarData.concat(circlePositions[0], circlePositions[1], circlePositions[2]);
    
    // append grays
    for (var i = 0; i < triangleVertexNum; i++) {
        ninjaStarData= ninjaStarData.concat(gray);
    }
}

function ninjaStarCircle() {
    circle(0, 0);
    circle(0, 1 / 2);
    circle(-1 / 2, 0);
    circle(0, -1 / 2);
    circle(1 / 2, 0);
}

function circle(a, b) {
    var origin = [a, b];
    var r = 0.1;

    for (var i = 0; i <= triangleFanNumber; i += 1) {
        var j = i * Math.PI / 180;
        var vert = [r * Math.sin(j) + a, r * Math.cos(j) + b];
        ninjaStarData.push(vert[0], vert[1]);
    }
}

function scale () {
    
}

function rotation () {
    
}

function alpha () {
    
}
