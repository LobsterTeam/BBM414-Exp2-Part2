/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const triangleVertexShader = `#version 300 es

    in vec2 i_position;
    in vec3 i_color;
    in float i_change_color;

    out vec3 color;
    out float change_color;
    out float rotate_angle;

    uniform float u_rotate_angle;

    void main() {

        vec2 u_position = vec2(0.0,0.0);
        float sin1 = cos(u_rotate_angle);
        float cos1 = sin(u_rotate_angle);

        u_position.x = (cos1 * i_position.x) - (sin1 * i_position.y);
        u_position.y = (cos1 * i_position.y) + (sin1 * i_position.x);

        gl_Position = vec4(u_position.x, u_position.y, 0.0, 1.0); 
        color = i_color;
        change_color = i_change_color;
        rotate_angle = u_rotate_angle;
    }
`;

const triangleFragmentShader = `#version 300 es

    precision mediump float;
    in vec3 color;
    in float change_color;
    in float rotate_angle;

    out vec4 o_color;
    
    void main() {

        vec3 oo_color = vec3(0.0, 0.0, 0.0);
        float component;
        float cos1 = cos(rotate_angle);
        component = pow(cos1, -2.0);

        oo_color.x = component * color.x;
        oo_color.y = component * color.y;
        oo_color.z = color.z;
        
        o_color = vec4(oo_color, 1.0);
    }
`;

const circleVertexShader = `#version 300 es

    in vec2 i_position;

    uniform float u_rotate_angle;

    void main() {
        vec2 u_position = vec2(0.0,0.0);
        float sin1 = cos(u_rotate_angle);
        float cos1 = sin(u_rotate_angle);

        u_position.x = (cos1 * i_position.x) - (sin1 * i_position.y);
        u_position.y = (cos1 * i_position.y) + (sin1 * i_position.x);
        
        gl_Position = vec4(u_position.x, u_position.y, 0.0, 1.0);
    }
`;

const circleFragmentShader = `#version 300 es

    precision mediump float;
    out vec4 o_color;

    void main() {
        o_color = vec4(250.0 / 255.0, 237.0 / 255.0, 51.0 / 255.0,1.0);
    }
`;