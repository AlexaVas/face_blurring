
#define MAX_POINTS 20 // maximum number of click points
uniform sampler2D uImage;
uniform int uNumPoints; // Number of click points
uniform vec3 uClickPoints[MAX_POINTS]; // Array of click points
uniform float uDistortion;
uniform float uRadius[MAX_POINTS]; // Array of radius

varying vec2 vUv;
varying vec3 vPosition;

// Function to convert Cartesian coordinates to spherical coordinates
vec2 cartesianToSpherical(vec3 cartesian) {
    float longitude = atan(cartesian.z, cartesian.x);
    float latitude = asin(cartesian.y / length(cartesian));
    return vec2(longitude, latitude);
}

// Function to calculate the angular distance between two spherical coordinates
float angularDistance(vec2 sph1, vec2 sph2) {
    float dLong = sph1.x - sph2.x;
    float dLat = sph1.y - sph2.y;
    float a = sin(dLat / 2.0) * sin(dLat / 2.0) +
              cos(sph1.y) * cos(sph2.y) *
              sin(dLong / 2.0) * sin(dLong / 2.0);
    return 2.0 * atan(sqrt(a), sqrt(1.0 - a));
}

void main() {

    vec4 color = texture2D(uImage, vUv);
    float PI = 3.14159265359;
    
    // Loop over each click point
    for (int k = 0; k < uNumPoints; ++k) {
        vec3 clickPoint = uClickPoints[k];
        float blurRadius = uRadius[k];

        // Calculate distance from camera to fragment
        float distanceToCamera = length(vPosition - cameraPosition);
        // Scale the blur radius based on the distance to the camera
        float scaledBlurRadius = blurRadius / distanceToCamera;

        // Convert fragment position to spherical coordinates
        vec2 fragSpherical = cartesianToSpherical(vPosition);

        // Convert click point to spherical coordinates
        vec2 clickSpherical = cartesianToSpherical(clickPoint);

        // Calculate spherical distance between fragment and click point
        float distance = angularDistance(fragSpherical, clickSpherical);

        // Determine if the fragment is within the blur radius
        if (distance <= blurRadius) {
            vec4 blurColor = vec4(0.0);
            int samples = 2; // number of samples
            float totalWeight = 0.0;

            for (int i = -samples; i <= samples; ++i) {
                for (int j = -samples; j <= samples; ++j) {
                    // Calculate offset in spherical coordinates
                    float offsetLat = float(i) / float(samples) * (uDistortion * scaledBlurRadius);
                    float offsetLong = float(j) / float(samples) * (uDistortion * scaledBlurRadius);
                    vec2 offsetSpherical = fragSpherical + vec2(offsetLong, offsetLat);

                    offsetSpherical.x = mod(offsetSpherical.x + PI, 2.0 * PI) - PI; // Wrap longitude
                    offsetSpherical.y = clamp(offsetSpherical.y, -(PI*0.5), PI*0.5); // Clamp latitude

                    // Convert offset spherical coordinates back to UV coordinates
                    vec2 offsetUv = vec2((-offsetSpherical.x + PI) / (2.0 * PI), 
                                         (offsetSpherical.y + PI*0.5) / PI);

                    blurColor += texture2D(uImage, offsetUv);
                    totalWeight += 1.0;
                }
            }

            blurColor /= totalWeight; // Take the average color
            color = blurColor; // Replace the original color with the blurred color
            break; // Exit the loop 
        }
    }

    gl_FragColor = color;
}

