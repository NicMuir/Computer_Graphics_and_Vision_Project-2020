//Quick notes:
//ground with height differencr of 1 will act as a stair

//Heightmap
//orbital controls



var scene, camera,raycamera, renderer, loop,char,chardata,controller;
var mesh, oceanGeometry, material, clock;
var Collidables = [];

var DeathCounter = 0;
var PointsCounter = 0;




var distanceprev;
var frame = 0;
var xSpeed = 0.5;
var zSpeed = 0.5;
var ySpeed = 0;
var camstartx = 0;
var camstarty = 15;
var camstartz = 30;

var charstartx = 0;
var charstarty = 0;
var charstartz = 0;

chardata = {
	W:1,
	H:1,
	B:1,
	jump:true,
	x_vel:0,
	y_vel:0,
	z_vel:0,
	x:0,
	y:20,
	z:0,
	rotationy:0
};
var character = new THREE.Object3D();

//raycasting
var rayforward = new THREE.Raycaster();
var raybackward = new THREE.Raycaster();
var raydown = new THREE.Raycaster();
var rayleft = new THREE.Raycaster();
var rayright = new THREE.Raycaster();

//Scene and camear etc
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
camera.position.set(camstartx,camstarty,camstartz);
camera.lookAt(chardata.x,chardata.y,chardata.z);
camera.updateProjectionMatrix();
controls = new THREE.PointerLockControls(camera);



//char Vector3
var charvec = new THREE.Vector3(chardata.x,chardata.y,chardata.z);
//array of intersecting objects


var fobj = new Array();
var bobj= new Array();
var dobj= new Array();
var lobj= new Array();
var robj= new Array();


init();

function init(){

	clock = new THREE.Clock();

	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild(renderer.domElement );



	getarrMap1();
	Charinit();

	var Rby = genruby();

	for(let k=0;k<Rby.length;k++){
		Rby[k].position.x = 10*k;
		Rby[k].position.z = 10*k;
		Rby[k].position.y = 7;

	}
	var temp = Rby[0];
	scene.add(temp);
	console.log(Rby);
	for(let k = 0;k<Rby.length;k++){
		scene.add(Rby[k]);
	}


///////////////////////


	for(let k =0 ;k<ObjectsMap1Arr.length;k++){
		scene.add( ObjectsMap1Arr[k] );
		Collidables.push(ObjectsMap1Arr[k]);
	}

	controls.getObject().add(CharacterBuild);
	scene.add(controls.getObject());
	SetLight();
}

function animate() {

				requestAnimationFrame( animate );
				render();
			}

function render(){
	var time = clock.getElapsedTime() * 10;

				var position = oceanGeometry.attributes.position;

				for ( var i = 0; i < position.count; i ++ ) {

					var y = 5 * Math.sin( i / 5 + ( time + i ) / 7 );
					position.setY( i, y );

				}

				position.needsUpdate = true;
	renderer.render(scene,camera);
};


controller = {
		forward:false,
		back:false,
		left:false,
		right:false,
		up:false,
			keyListener:function(event){
				var keystate = (event.type == "keydown")?true:false;
				switch (event.keyCode) {
					case 87:
							controller.forward = keystate;
						break;
					case 83:
							controller.back = keystate;
						break;
					case 65:
							controller.left = keystate;
						break;
					case 68:
							controller.right = keystate;
						break;
					case 32:
							controller.up = keystate;
						break;
				}
			}
}


loop = function(){



	//checkruby();




	distanceprev = chardata.y;
	Movechar(chardata.x,chardata.y,chardata.z);
	colisiondetection(controls.getObject());
	if(controller.up && chardata.jump == false){

		//must be a mutiple of the gravity
		chardata.y_vel +=5;
		chardata.jump = true;
	}

	if(controller.left){
		// char.rotation.y-=0.04;
		// chardata.rotationy -= 0.04
		chardata.x_vel -=0.04;
	}
	if(controller.right){
		chardata.x_vel +=0.04;
		// char.rotation.y +=0.04;
		// chardata.rotationy += 0.04
	}
	if(controller.forward){
		chardata.z_vel -=0.04;
	}
	if(controller.back){
		chardata.z_vel +=0.04;
	}
	chardata.y_vel -=0.25;//gravity(0.25)
	chardata.y += chardata.y_vel;
	chardata.x_vel *= 0.8;//friction
	chardata.y_vel *= 0.8;//friction
	chardata.z_vel *= 0.9;//friction
if(dobj.length != 0){
	if(chardata.jump == true && dobj[0].distance<3 && distanceprev>chardata.y){
			chardata.jump = false;
	}
}
	if(chardata.y<-50){
		DeathCounter= DeathCounter+1;
		chardata.x=0;
		chardata.y=2;
		chardata.z=0;
		chardata.jump = false;
		controls.getObject().position.set(charstartx,charstarty,charstartz);
		//camera.lookAt(0,0,0);
	}
	if(chardata.jump == false && dobj.length != 0){
		chardata.jump = false;
		chardata.y = dobj[0].point.y+0.5;
}
	//forward collis
	if(fobj.length != 0){
		if(fobj[0].distance < 1){
			chardata.jump = true;
			chardata.z_vel = 0;
			controls.getObject().position.z = fobj[0].point.z-1.1;
		}
	}
	if(bobj.length != 0){
		if(bobj[0].distance < 1){
			chardata.jump = true;
			chardata.z_vel = 0;
			controls.getObject().position.z = bobj[0].point.z+1.1;
		}
	}
	if(lobj.length != 0){
		if(lobj[0].distance < 1){
			chardata.jump = true;
			chardata.x_vel = 0;
			controls.getObject().position.x = lobj[0].point.x-1.5;
		}
	}
	if(robj.length != 0){
		if(robj[0].distance < 1){
			chardata.jump = true;
			chardata.x_vel = 0;
			controls.getObject().position.x = robj[0].point.x+1.5;
		}
	}
//



	Movechar(chardata.x,chardata.y,chardata.z);
	render();
  window.requestAnimationFrame(loop);
}


function colisiondetection(char){

	let realRot = controls.getObject().rotation.y;
	let screenRot;
	 if(controls.getObject().position.z == 0) {
			 screenRot = Math.PI / 2 * Math.sign(controls.getObject().position.x);
	 } else {
			 if(controls.getObject().position.x != 0) {
					 screenRot = Math.atan(controls.getObject().position.x / controls.getObject().position.z);
			 } else {
					 if(controls.getObject().position.z == -1) {
							 screenRot = Math.PI;
					 } else {
							 screenRot = 0;
					 }
			 }
	 }

		let rot = (Math.PI + realRot) + screenRot;
		 //rays in order to check for collisions
		 var forw  = new THREE.Vector3(Math.sin(rot), 0, -Math.cos(rot)); //Forward
		 var backw = new THREE.Vector3(Math.sin(rot), 0, Math.cos(rot)); //back
		 var left  = new THREE.Vector3(Math.sin(rot - Math.PI / 2), 0, Math.cos(rot - Math.PI / 2)); //Left
		 var right = new THREE.Vector3(Math.sin(rot + Math.PI / 2), 0, Math.cos(rot + Math.PI / 2)); //Right
		 var downw = new THREE.Vector3(0, -1, 0); //Down
		charvec.set(controls.getObject().position.x,controls.getObject().position.y,controls.getObject().position.z);
		//raycaster.set(pos , direc);
		rayforward.set(charvec , forw);//farward
		raybackward.set(charvec , backw);//back
		raydown.set(charvec , downw);//down
		rayleft.set(charvec , left);//left
		rayright.set(charvec , right);//right
		//.intersectObjects ( objects : Array, recursive : Boolean, optionalTarget : Array ) : Array
		fobj = rayforward.intersectObjects(Collidables);
		bobj = raybackward.intersectObjects(Collidables);
		dobj = raydown.intersectObjects(Collidables);
		lobj = rayleft.intersectObjects(Collidables);
		robj = rayright.intersectObjects(Collidables);
};


function SetLight(){
	var light = new THREE.AmbientLight(0x404040);
	scene.add(light);

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
	directionalLight.position.set( 0,4,1 );
	directionalLight.castShadow = true;

	scene.add( directionalLight );
};


function Movechar(x1,y1,z1){
	controls.getObject().translateZ(chardata.z_vel);
	controls.getObject().translateX(chardata.x_vel);
	controls.getObject().position.y=chardata.y;
}




//rotate Vectors

function rotatevec(vec , angle){
	vector.applyAxisAngle( axis, angle );
}

function OnMouseDown(event){
	if(!controls.isLocked){
		controls.lock();
	}
}

function GenCoinList(){
	for(let k =0 ; k<5;k++){
		CoinList.push(new gencoin());
	}
}







function checkruby(){
	for(let k = 0 ; k< Ruby.length;k++){
		if(controls.getObject().position.x <= (Ruby[k].position.x+2) && controls.getObject().position.x >= (Ruby[k].position.x-2) && controls.getObject().position.z >= Ruby[k].position.z-2 && controls.getObject().position.z <= Ruby[k].position.z+2){
			PointsCounter = PointsCounter+5;
			scene.remove(Ruby[k])

		}
	}
}


//Event Listeners:

window.addEventListener("keydown",controller.keyListener);
window.addEventListener("keyup",controller.keyListener);
window.addEventListener("mousedown",OnMouseDown,false);
window.requestAnimationFrame(loop);
