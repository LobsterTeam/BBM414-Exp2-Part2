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
const gray = vec3(64 / 255.0, 64 / 255.0, 64 / 255.0);
const Sx = 0.5, Sy = 0.5;
var ninjaStarData = [];
var angleInRadians = 0;
var scaleMatrix = scaleNinjaStar(0.5, 0.5);
var turnRight = true;
var fourtyFiveDegreesInRadians = 45 * Math.PI / 180;
var minDegreeInRadians = 0.01 * Math.PI / 180;
var startRotation = false;
var speed = 2;
var changeColor = false;

function main() {
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
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    
    // DRAW TRIANGLES OF NINJA STAR
    ninjaStarTriangle(); 
    const triangleShader = initShaderProgram(gl, triangleVertexShader, triangleFragmentShader);
    const triangleBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(gl.getAttribLocation(triangleShader, "a_position"));
    gl.enableVertexAttribArray(gl.getAttribLocation(triangleShader, "a_color"));
    var triangleMatrix = gl.getUniformLocation(triangleShader, 'u_matrix');
    
    // DRAW CIRCLES OF NINJA STAR
    ninjaStarCircle();
    const circleShader = initShaderProgram(gl, circleVertexShader, circleFragmentShader);
    const circleBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(gl.getAttribLocation(circleShader, "a_position"));
    var circleMatrix = gl.getUniformLocation(circleShader, 'u_matrix');
    
    // ROTATION ANIMATION
    function drawScene () {
        
               
        if (angleInRadians >= fourtyFiveDegreesInRadians) {        // 45
            turnRight = false;
        } else if (angleInRadians <= (-1 * fourtyFiveDegreesInRadians)) {     // -45
            turnRight = true;
        }
        
        if (turnRight) {
            angleInRadians += minDegreeInRadians * speed;
        } else {
            angleInRadians -= minDegreeInRadians * speed;
        }
        
        console.log(angleInRadians);
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        // MATRICES
        var rotationMatrix = rotateNinjaStar(angleInRadians);
        var matrix = multiplyMatrices(scaleMatrix, rotationMatrix);
        
        // TRIANGLES
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ninjaStarData), gl.STATIC_DRAW);
    
        // TRIANGLE POSITIONS
        var numOfComponents = 2;        // x and y (2d)
        var offset = 0;
        gl.vertexAttribPointer(gl.getAttribLocation(triangleShader, "a_position"),
            numOfComponents, type, normalize, stride, offset);
            
        // TRIANGLE COLORS
        numOfComponents = 3;
        offset = triangleVertexNum * 2 * 4;     // each vertex has 2 components
        gl.vertexAttribPointer(gl.getAttribLocation(triangleShader, "a_color"),
                numOfComponents, type, normalize, stride, offset);

        // SCALING TRIANGLES
        gl.useProgram(triangleShader);
        gl.uniformMatrix3fv(triangleMatrix, false, matrix);
        
        // DRAW TRIANGLES
        offset = 0;
        gl.drawArrays(gl.TRIANGLES, offset, triangleVertexNum);

        // CIRCLES
        gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ninjaStarData), gl.STATIC_DRAW);
        
        // CIRCLE POSITIONS
        numOfComponents = 2;
        offset = (12 * 5) * 4;      // 2 components for positions, 3 for colors
        gl.vertexAttribPointer(gl.getAttribLocation(circleShader, "a_position"),
                numOfComponents, type, normalize, stride, 240);
                
        // SCALING CIRCLES
        gl.useProgram(circleShader);
        gl.uniformMatrix3fv(circleMatrix, false, matrix);

        // DRAW CIRCLES
        for (var i = 0; i < 5; i++) {
            gl.drawArrays(gl.TRIANGLE_FAN, i * triangleFanNumber + i, triangleFanNumber);
        }
        if (startRotation) {
            requestAnimationFrame(drawScene);
        }
    }
    
    drawScene();
    
    document.addEventListener('keydown', function(event) {
    
    switch(event.keyCode) {
        case 49:        // key 1
        case 97:        // numpad 1
            // first
            startRotation = false;
            angleInRadians = 0;
            speed = 2;
            break;
        case 50:        // key 2
        case 98:        // numpad 2
            // rotate
            startRotation = true;
            turnRight = true;
            drawScene();

            break;
            
        case 51:        // key 3
        case 99:        // numpad 3
            startRotation = true;
            turnRight = true;
            drawScene();
            
            break;
            
        case 38:        // arrow up
            if (speed < 257 && startRotation)
                speed *= 2;
            //console.log(speed);
            break;
        case 40:        // arrow down
            if (speed > 3 && startRotation)
                speed /= 2;
            //console.log(speed);
            break;
        default:
            break;
    }

});

    
    
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

function scaleNinjaStar(Sx, Sy) {
    return [
        Sx, 0.0, 0.0,
        0.0, Sy, 0.0,
        0.0, 0.0, 1.0
    ];
}

function rotateNinjaStar(angleInRadians) {
    // rotate about the z-axis
    var cos = Math.cos(angleInRadians);
    var sin = Math.sin(angleInRadians);
    return [
        cos,-sin, 0.0,
        sin, cos, 0.0,
        0.0, 0.0, 1.0];
}

function changeAlphaOfTriangles () {
    
}

function multiplyMatrices(a, b) {
    var a00 = a[0*3+0];
    var a01 = a[0*3+1];
    var a02 = a[0*3+2];
    var a10 = a[1*3+0];
    var a11 = a[1*3+1];
    var a12 = a[1*3+2];
    var a20 = a[2*3+0];
    var a21 = a[2*3+1];
    var a22 = a[2*3+2];
    var b00 = b[0*3+0];
    var b01 = b[0*3+1];
    var b02 = b[0*3+2];
    var b10 = b[1*3+0];
    var b11 = b[1*3+1];
    var b12 = b[1*3+2];
    var b20 = b[2*3+0];
    var b21 = b[2*3+1];
    var b22 = b[2*3+2];
    return [a00 * b00 + a01 * b10 + a02 * b20,
            a00 * b01 + a01 * b11 + a02 * b21,
            a00 * b02 + a01 * b12 + a02 * b22,
            a10 * b00 + a11 * b10 + a12 * b20,
            a10 * b01 + a11 * b11 + a12 * b21,
            a10 * b02 + a11 * b12 + a12 * b22,
            a20 * b00 + a21 * b10 + a22 * b20,
            a20 * b01 + a21 * b11 + a22 * b21,
            a20 * b02 + a21 * b12 + a22 * b22];
}



main();