/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const triangleVertexShader = `#version 300 es

    in vec2 a_position;
    in vec3 a_color;
    out vec3 color;

    uniform mat3 u_position_matrix;
    uniform mat3 u_color_matrix;

    void main() {
        gl_Position = vec4((u_position_matrix * vec3(a_position, 1)), 1);
        color = a_color * u_color_matrix ;
    }
`;

const triangleFragmentShader = `#version 300 es

    precision mediump float;
    in vec3 color;
    out vec4 o_color;
    
    void main() {
        o_color = vec4(color, 1.0);
    }
`;

const circleVertexShader = `#version 300 es

    in vec2 a_position;

    uniform mat3 u_matrix;

    void main() {
        gl_Position = vec4((u_matrix * vec3(a_position, 1)), 1);
    }
`;

const circleFragmentShader = `#version 300 es

    precision mediump float;
    out vec4 o_color;

    void main() {
        o_color = vec4(250.0 / 255.0, 237.0 / 255.0, 51.0 / 255.0,1.0);
    }
`;