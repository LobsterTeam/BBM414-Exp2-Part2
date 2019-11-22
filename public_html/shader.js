/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const triangleVertexShader = `#version 300 es

    in vec2 i_position;
    in vec3 i_color;

    out vec3 color;
    out float change_color;
    out float rotate_angle;
    
    uniform float u_change_color;
    uniform float u_rotate_angle;

    void main() {

        vec2 u_position = vec2(0.0,0.0);
        float sin_value = cos(u_rotate_angle);
        float cos_value = sin(u_rotate_angle);

        u_position.x = (cos_value * i_position.x) - (sin_value * i_position.y);
        u_position.y = (cos_value * i_position.y) + (sin_value * i_position.x);

        gl_Position = vec4(u_position.x, u_position.y, 0.0, 1.0); 
        color = i_color;
        change_color = u_change_color;
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

        float component;
        if (change_color == 1.0) {       // 3
            float sin_value = sin(rotate_angle);
            component = 1.0 +  abs(sin_value);
            
        } else {        // 2
            component = 1.0;
        }
        o_color.x = component * color.x;
        o_color.y = component * color.y;
        o_color.z = color.z;
        o_color.w = 1.0;
    }
`;

const circleVertexShader = `#version 300 es

    in vec2 i_position;

    uniform float u_rotate_angle;

    void main() {
        vec2 u_position = vec2(0.0,0.0);
        float sin_value = cos(u_rotate_angle);
        float cos_value = sin(u_rotate_angle);

        u_position.x = (cos_value * i_position.x) - (sin_value * i_position.y);
        u_position.y = (cos_value * i_position.y) + (sin_value * i_position.x);
        
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