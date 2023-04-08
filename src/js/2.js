/* // ! Types in GLSL
    //* float
    //* int
    //* bool
*/

/* // ! Vectors
   //* float vectors => vec  : vec2() vec3()  ...
   //* int vectors   => ivec : ivec2() ivec3()...
   //* bool vectors  => bvec : bvec2() bvec() ...

   flaot a1 = vect.x   float b1 = vect.y   float c1 = vect.z   float d1 = vect.w
   flaot a2 = vect.r   float b2 = vect.g   float c2 = vect.b   float d2 = vect.a
   flaot a3 = vect.s   float b3 = vect.t   flaot c3 = vect.p   float d3 = vect.q
*/

/* // ! Matrices
    //* mat2
    //* mat3
    //* mat4
*/

/* // ! Samplers : a variable where we can store an image data
    //* sampler2D
    //* samplerCube
*/

/* // ! Arrays
    float arrayA[7]...
*/

/* // ! Structures
    struct myType {
        int c1;
        vect3 c2;
    }
    myType a;
*/

/* // ! Storage Qualifiers
    //* const ======> const type identifier = value;
    //* attribute ==> attribute type identifier;       // receives data from the outside of GLSL code,
    //* uniform ====> uniform type identifier;         // from JavaScript side
    //* varying ====> varying type identifier;

    --> attribute holds data that is different from a vertex to another one like position / allowed only in vertex shaders
    --> uniform holds the data that is shared between vertices like time / allowed in both vertex and fragment shaders
    --> varying used to transform data from vertex shader to fragment shader
*/

/* // ! Precision Qualifiers : a way to optimise the ressource consumption (memory usage)
    //* lowp
    //* mediump =====> precision_qualifier type identifier;
    //* highp   or ==> precision precision_qualifier type;
*/