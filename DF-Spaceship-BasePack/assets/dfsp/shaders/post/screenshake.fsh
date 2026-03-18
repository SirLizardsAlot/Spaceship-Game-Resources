#version 150

uniform sampler2D InSampler;

in vec2 texCoord;
out vec4 fragColor;

layout(std140) uniform SamplerInfo {
    vec2 OutSize;
    vec2 InSize;
};

layout(std140) uniform ShakeConfig {
    float Time;
    float Strength;
    float Speed;
    float Chromatic;
};

float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

void main() {
    float t = Time * Speed;
    float jitterX = (hash(floor(t)) - 0.5) * 2.0;
    float jitterY = (hash(floor(t) + 17.0) - 0.5) * 2.0;
    vec2 offset = vec2(jitterX, jitterY) * Strength + vec2(
        sin(t * 1.7) * Strength * 0.3,
        cos(t * 2.1) * Strength * 0.25
    );

    vec2 redUv = clamp(texCoord + offset + vec2(Chromatic, 0.0), vec2(0.0), vec2(1.0));
    vec2 greenUv = clamp(texCoord + offset, vec2(0.0), vec2(1.0));
    vec2 blueUv = clamp(texCoord + offset - vec2(Chromatic, 0.0), vec2(0.0), vec2(1.0));

    vec4 red = texture(InSampler, redUv);
    vec4 green = texture(InSampler, greenUv);
    vec4 blue = texture(InSampler, blueUv);

    fragColor = vec4(red.r, green.g, blue.b, green.a);
}
