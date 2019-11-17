"use strict";
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// FIDAN SAMET 21727666
// OGUZ BAKIR 21627007
const triangleVertexNum = 12;
var trianglePositions = [];
var triangleColors = [];
var circlePositions = [];

window.onload = function init() {
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    // DRAW TRIANGLES OF NINJA STAR
    ninjaStarTriangle();

    var positionArray = [];
    for (var i = 0; i < triangleVertexNum; i++) {
        positionArray = positionArray.concat(trianglePositions[i]);
    }
    var colorArray = [];
    for (var i = 0; i < triangleVertexNum; i++) {
        colorArray = colorArray.concat(triangleColors[i]);
    }

    const triangleData = positionArray.concat(colorArray);
    gl.clearColor(250 / 255.0, 237 / 255.0, 51 / 255.0, 1.0);       // yellow
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var numOfComponents = 2;        // x and y (2d)
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    var offset = 0;

    const triangleShader = initShaderProgram(gl, triangleVertexShader, triangleFragmentShader);
    const triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleData), gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(positionArray));
    gl.bufferSubData(gl.ARRAY_BUFFER, positionArray.length * 4, new Float32Array(colorArray));
    //console.log(data);
    //console.log(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));

    gl.useProgram(triangleShader);
    gl.enableVertexAttribArray(gl.getAttribLocation(triangleShader, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(triangleShader, "a_position"),
            numOfComponents, type, normalize, stride, offset);
    numOfComponents = 3;
    offset = positionArray.length * 4;
    gl.enableVertexAttribArray(gl.getAttribLocation(triangleShader, "a_color"));
    gl.vertexAttribPointer(gl.getAttribLocation(triangleShader, "a_color"),
            numOfComponents, type, normalize, stride, offset);
    gl.useProgram(triangleShader);
    offset = 0;
    gl.drawArrays(gl.TRIANGLES, offset, triangleVertexNum);

    // DRAW CIRCLES OF NINJA STAR
    ninjaStarCircle();
    
    var numOfComponents = 2;
    var offset = 0;
    const circleShader = initShaderProgram(gl, circleVertexShader, circleFragmentShader);

    var circleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circlePositions), gl.STATIC_DRAW);
    //console.log(data);
    //console.log(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));
    gl.useProgram(circleShader);
    gl.enableVertexAttribArray(gl.getAttribLocation(circleShader, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(circleShader, "a_position"),
            numOfComponents, type, normalize, stride, offset);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 360);
    gl.drawArrays(gl.TRIANGLE_FAN, 361, 360);
    gl.drawArrays(gl.TRIANGLE_FAN, 722, 360);
    gl.drawArrays(gl.TRIANGLE_FAN, 1083, 360);
    gl.drawArrays(gl.TRIANGLE_FAN, 1444, 360);
}

function ninjaStarTriangle() {
    var circlePositions = [
        vec2(-1, 1),
        vec2(1 / 3, 1 / 3),
        vec2(-1 / 3, -1 / 3)
    ];
    triangle(circlePositions[0], circlePositions[1], circlePositions[2]);

    var circlePositions = [
        vec2(-1, -1),
        vec2(-1 / 3, 1 / 3),
        vec2(1 / 3, -1 / 3)
    ];
    triangle(circlePositions[0], circlePositions[1], circlePositions[2]);

    var circlePositions = [
        vec2(1, -1),
        vec2(1 / 3, 1 / 3),
        vec2(-1 / 3, -1 / 3)
    ];
    triangle(circlePositions[0], circlePositions[1], circlePositions[2]);

    var circlePositions = [
        vec2(1, 1),
        vec2(-1 / 3, 1 / 3),
        vec2(1 / 3, -1 / 3)
    ];
    triangle(circlePositions[0], circlePositions[1], circlePositions[2]);
}

function triangle(a, b, c) {
    trianglePositions.push(a, b, c);
    triangleColors.push(vec3(126 / 255.0, 126 / 255.0, 126 / 255.0), vec3(126 / 255.0, 126 / 255.0, 126 / 255.0), vec3(126 / 255.0, 126 / 255.0, 126 / 255.0));
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

    for (var i = 0; i <= 360; i += 1) {
        var j = i * Math.PI / 180;
        var vert = [r * Math.sin(j) + a, r * Math.cos(j) + b];
        circlePositions.push(vert[0], vert[1]);
    }
}
