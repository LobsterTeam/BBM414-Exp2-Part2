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
const fourtyFiveDegreesInRadians = 45 * Math.PI / 180;
const minDegreeInRadians = Math.PI / 180;
const initialSpeed = 1;
var ninjaStarData = [];
var angleInRadians = 0;
var speed = initialSpeed;
var turnRight = true;
var startRotation = false;
var changeColor = 0.0;

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
    gl.enableVertexAttribArray(gl.getAttribLocation(triangleShader, 'i_position'));
    gl.enableVertexAttribArray(gl.getAttribLocation(triangleShader, 'i_color'));
    var triangleRotateAngle = gl.getUniformLocation(triangleShader, 'u_rotate_angle');
    var triangleChangeColor = gl.getUniformLocation(triangleShader, 'u_change_color');
    
    // DRAW CIRCLES OF NINJA STAR
    ninjaStarCircle();
    const circleShader = initShaderProgram(gl, circleVertexShader, circleFragmentShader);
    const circleBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(gl.getAttribLocation(circleShader, 'i_position'));
    var circleRotateAngle = gl.getUniformLocation(circleShader, 'u_rotate_angle');
    
    // ROTATION ANIMATION
    function render () {
        
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
        
        // TRIANGLES
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ninjaStarData), gl.STATIC_DRAW);
    
        // TRIANGLE POSITIONS
        var numOfComponents = 2;        // x and y (2d)
        var offset = 0;
        gl.vertexAttribPointer(gl.getAttribLocation(triangleShader, 'i_position'),
            numOfComponents, type, normalize, stride, offset);
            
        // TRIANGLE COLORS
        numOfComponents = 3;
        offset = triangleVertexNum * 2 * 4;     // each vertex has 2 components
        gl.vertexAttribPointer(gl.getAttribLocation(triangleShader, 'i_color'),
                numOfComponents, type, normalize, stride, offset);

        // ROTATING TRIANGLES
        gl.useProgram(triangleShader);
        gl.uniform1f(triangleRotateAngle, angleInRadians);
        gl.uniform1f(triangleChangeColor, changeColor);
        
        // DRAW TRIANGLES
        offset = 0;
        gl.drawArrays(gl.TRIANGLES, offset, triangleVertexNum);

        // CIRCLES
        gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ninjaStarData), gl.STATIC_DRAW);
        
        // CIRCLE POSITIONS
        numOfComponents = 2;
        offset = (12 * 5) * 4;      // 2 components for positions, 3 for colors
        gl.vertexAttribPointer(gl.getAttribLocation(circleShader, 'i_position'),
                numOfComponents, type, normalize, stride, 240);
                
        // ROTATING CIRCLES
        gl.useProgram(circleShader);
        gl.uniform1f(circleRotateAngle, angleInRadians);

        // DRAW CIRCLES
        for (var i = 0; i < 5; i++) {
            gl.drawArrays(gl.TRIANGLE_FAN, i * triangleFanNumber + i, triangleFanNumber);
        }
        
        // animate on 2 and 3
        if (startRotation) {
            requestAnimationFrame(render);
        }
    }
    
    render();
    
    document.addEventListener('keydown', function(event) {
    
        switch(event.keyCode) {
            // KEY 1 and NUMPAD 1 - INITIAL POSITION
            case 49:        // key 1
            case 97:        // numpad 1
                startRotation = false;
                changeColor = 0.0;
                angleInRadians = 0;
                speed = initialSpeed;
                break;
            // KEY 2 and NUMPAD 2 - ROTATE
            case 50:        // key 2
            case 98:        // numpad 2
                if (changeColor == 1.0) {
                    // rotating and changing colors
                    changeColor = 0.0;
                } else if (startRotation == false) {
                    // not rotating
                    changeColor = 0.0;
                    startRotation = true;
                    turnRight = true;
                    render();
                }
                break;
            // KEY 3 and NUMPAD 3 - ROTATE and CHANGE 
            case 51:        // key 3
            case 99:        // numpad 3
                if (startRotation == true && changeColor == 0.0) {
                    // rotating but not changing color
                    changeColor = 1.0;
                } else if (startRotation == false) {
                    // not rotating
                    changeColor = 1.0;
                    startRotation = true;
                    turnRight = true;
                    render();
                }
                break;
            case 38:        // arrow up
                if (speed < 1 && startRotation) {   // speed smaller than 1
                    speed *= 2;
                } else if (speed < 10 && startRotation) {   // speed between 1 and 10
                    speed += 1;
                }
                console.log(speed);
                break;
            case 40:        // arrow down
                if (speed > 1 && startRotation) {       // speed greater than 1
                    speed -= 1;
                } else if (startRotation) {     // go to infinity
                    speed /= 2;
                }
                console.log(speed);
                break;
            default:
                break;
        }
    });
}

function ninjaStarTriangle() {
    var trianglePositions = [
        vec2(-1 / 2, 1 / 2),
        vec2(1 / 6, 1 / 6),
        vec2(-1 / 6, -1 / 6)
    ];
    ninjaStarData = ninjaStarData.concat(trianglePositions[0], trianglePositions[1], trianglePositions[2]);

    trianglePositions = [
        vec2(-1 / 2, -1 / 2),
        vec2(-1 / 6, 1 / 6),
        vec2(1 / 6, -1 / 6)
    ];
    ninjaStarData = ninjaStarData.concat(trianglePositions[0], trianglePositions[1], trianglePositions[2]);

    trianglePositions = [
        vec2(1 / 2, -1 / 2),
        vec2(1 / 6, 1 / 6),
        vec2(-1 / 6, -1 / 6)
    ];
    ninjaStarData = ninjaStarData.concat(trianglePositions[0], trianglePositions[1], trianglePositions[2]);

    trianglePositions = [
        vec2(1 / 2, 1 / 2),
        vec2(-1 / 6, 1 / 6),
        vec2(1 / 6, -1 / 6)
    ];
    ninjaStarData = ninjaStarData.concat(trianglePositions[0], trianglePositions[1], trianglePositions[2]);
    
    // append grays
    for (var i = 0; i < triangleVertexNum; i++) {
        ninjaStarData= ninjaStarData.concat(gray);
    }
}

function ninjaStarCircle() {
    circle(0, 0);
    circle(0, 1 / 4);
    circle(-1 / 4, 0);
    circle(0, -1 / 4);
    circle(1 / 4, 0);
}

function circle(a, b) {
    var origin = [a, b];
    var r = 0.05;

    for (var i = 0; i <= triangleFanNumber; i += 1) {
        var j = i * Math.PI / 180;
        var vert = [r * Math.sin(j) + a, r * Math.cos(j) + b];
        ninjaStarData.push(vert[0], vert[1]);
    }
}

main();