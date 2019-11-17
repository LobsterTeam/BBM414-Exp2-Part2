/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const triangleVertexShader = `#version 300 es

    in vec4 a_position;
    in vec3 a_color;

    uniform mat4 u_matrix;

    out vec3 color;
    void main() {
        gl_Position = u_matrix * a_position;
        color = a_color;
    }
`;

const triangleFragmentShader = `#version 300 es

    precision mediump float;
    in vec3 color;

    out vec4 o_color;
    void main() {
        o_color = vec4(color,1.0);
    }
`;

const circleVertexShader = `#version 300 es

    in vec4 a_position;

    uniform mat4 u_matrix;

    void main() {
        gl_Position = u_matrix * a_position;
    }
`;

const circleFragmentShader = `#version 300 es

    precision mediump float;
    out vec4 o_color;

    void main() {
        o_color = vec4(250.0 / 255.0, 237.0 / 255.0, 51.0 / 255.0,1.0);
    }
`;