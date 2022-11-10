
// some globals
var gl;

var theta = 0.0;
var thetaLoc, colorLoc;
var numSquare = 0;
var delay = 100;
var direction = true;
var vBuffer, cBuffer;
var program;
var vertices = [];
var vcolors = [];
var color_vals = [Math.random(), Math.random(), Math.random(), 1.];
var color_vals2 = [Math.random(), Math.random(), Math.random(), 1.];
var theta2=0.0;
var counter = 0;
var max_prims = 200, num_triangles = 0;
var offsetJump=0;
var offsetColor=0;
var col = [];
window.onload = function init() {
	// get the canvas handle from the document's DOM
    var canvas = document.getElementById( "gl-canvas" );
    
	// initialize webgl
    gl = WebGLUtils.setupWebGL( canvas );

	// check for errors
    if ( !gl ) { 
		alert( "WebGL isn't available" ); 
	}

    // set up a viewing surface to display your image
    gl.viewport( 0, 0, canvas.width, canvas.height );

	// clear the display with a background color 
	// specified as R,G,B triplet in 0-1.0 range
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //  Load shaders -- all work done in init_shaders.js
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

	// make this the current shader program
    gl.useProgram( program );

	// Get a handle to theta  - this is a uniform variable defined 
	// by the user in the vertex shader, the second parameter should match
	// exactly the name of the shader variable
    thetaLoc = gl.getUniformLocation( program, "theta" );

	// we are also going manipulate the vertex color, so get its location
	colorLoc = gl.getUniformLocation(program, "vertColor");

	// set an initial color for all vertices
	gl.uniform4fv (colorLoc, [1., 0., 0., 1.])

	// create a vertex buffer - this will hold all vertices
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 300 * 6 * 2 * 4, gl.STATIC_DRAW);
	// create a vertex buffer
    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 300 * 6 * 4 * 4, gl.STATIC_DRAW);
	// create the square geometry, send it to GPU
//var i;
//for (i=0;i<300;++i){

	//updateVertices();
//for (int i=0;i<300;++i){
    render();
//};
};

function updateVertices() {
	// add a square at the center of the view (0, 0) of a fixed size
	// triangle 1
	// var x = 0;
	// var y = 0;
    var x = 0;
    var y = 0;
	vertices=[];
	vcolors = [];
	col = [];

	var z = Math.random();
	var y = Math.random() * (1-(-1)) + (-1);
	var x = Math.random() * (1-(-1)) + (-1);


	if (z<=0.33) {
    vertices.push([ x - 0.03 , y + 0.03]);
	vertices.push([ x - 0.03 , y - 0.03]);
	vertices.push([ x + 0.03 , y - 0.03]);

	// triangle 2
	vertices.push([ x - 0.03 , y + 0.03]);
	vertices.push([ x + 0.03 , y - 0.03]);
	vertices.push([ x + 0.03 , y + 0.03]);
}
else if (z>=0.34 && z <=0.67) {
	vertices.push([ x - 0.05 , y + 0.05]);
    vertices.push([ x - 0.05 , y - 0.05]);
    vertices.push([ x + 0.05 , y - 0.05]);

    	// triangle 2
    vertices.push([ x - 0.05 , y + 0.05]);
    vertices.push([ x + 0.05 , y - 0.05]);
    vertices.push([ x + 0.05 , y + 0.05 ]);
}
else if (z>=0.68) {
    vertices.push([ x - 0.02 , y + 0.02]);
    vertices.push([ x - 0.02 , y - 0.02]);
    vertices.push([ x + 0.02 , y - 0.02]);

        	// triangle 2
    vertices.push([ x - 0.02 , y + 0.02]);
    vertices.push([ x + 0.02 , y - 0.02]);
    vertices.push([ x + 0.02 , y + 0.02]);
}

	col = [Math.random(), Math.random(), Math.random(), 1.];

    vcolors.push(col);
    vcolors.push(col);
    vcolors.push(col);
    vcolors.push(col);
    vcolors.push(col);
    vcolors.push(col);
	//TODO: add a smaller square similar to above, right beside it
	/*var col;
    vcolors = [Math.random(), Math.random(), Math.random(), 1.];
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 6*offsetJump*4, vColor );*/
	// make sure the coordinates are within the -1.0 to 1.0 range in
	// X, Y

	// make the needed GL calls to tranfer vertices

	// bind the buffer, i.e. this becomes the current buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

	// transfer the data -- this is actually pretty inefficient!
	// flatten() function is defined in MV.js - this simply creates only
	// the vertex coordinate data array - all other metadata in Javascript
	// arrays should not be in the vertex buffer.
	//gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	gl.bufferSubData(gl.ARRAY_BUFFER, 3 * 2 * offsetJump * 4, flatten(vertices));
	// Associate out shader variables with our data buffer
	// note: "vposition" is a named variable used in the vertex shader and is
	// associated with vPosition here
	var vPosition = gl.getAttribLocation( program, "vPosition");

	// specify the format of the vertex data - here it is a float with
	// 2 coordinates per vertex - these are its attributes
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

	// enable the vertex attribute array 
	gl.enableVertexAttribArray(vPosition);


        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, offsetJump * 6 * 4 * 4 , flatten(vcolors) );
        var vColor = gl.getAttribLocation( program, "vColor");

        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

        	// enable the vertex attribute array
        gl.enableVertexAttribArray(vColor);

	offsetJump+=2;
	numSquare++;
}

//counter = 0;
function render() {
	// this is render loop

	// clear the display with the background color
    gl.clear( gl.COLOR_BUFFER_BIT );
    //gl.clear(cBuffer);

	// adds a square to the vertex list (2 triangles, consisting of 3 vertices
	// each
	//var i;
	if (numSquare<300){

    theta += Math.random();
	updateVertices();

	//theta += Math.random();
	//theta2 -= Math.random();
	//counter++;
	
	// set the theta value
	gl.uniform1f(thetaLoc, theta);

	// set the color, change it every 10 frames
	/*counter++;
	if (counter%10 == 0)
		color_vals = [Math.random(), Math.random(), Math.random(), 1.];
*/
	// set the color in the shader
	//gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	//gl.bufferSubData(gl.ARRAY_BUFFER, 6*offsetColor*4, vcolors );

	//gl.uniform4fv (colorLoc, color_vals)

	num_triangles = 2;
    //offsetColor += 12;
	// draw the square as a set of triangles
    gl.drawArrays(gl.TRIANGLES, 0, offsetJump*3);

	//gl.uniform1f(thetaLoc, theta2);


	// TODO: The above code draws the square; now you will call 
	//  gl to draw the second square; the vertices are following the
	//  vertices of the first square and start at index ??

	//  TODO: also change the color of the smaller square 

	//  TODO: make the second square rotate in the opposite direction
	//   and faster.

    //offsetColor +=4;
}

    setTimeout(
        function (){requestAnimFrame(render);}, delay
    );
}