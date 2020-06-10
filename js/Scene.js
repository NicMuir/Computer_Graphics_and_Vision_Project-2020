//Quick notes:
//ground with height difference of 1 will act as a stair

//Heightmap
//orbital controls
var scene, camera,raycamera, renderer, loop,char,chardata,controller;
var mesh, oceanGeometry, material, clock, TWEEN;
var Collidables = [];
var spinToplist3 = [];
var spinTop1, spinTop2, spinTop3, spinTop4, spinTop5;

var PauseState = false;

var DeathCounter = -1.;
var PointsCounter = 0;

var RPosList = [];
var RubyArr = [];
var CPosList = [];
var CoinArr = [];

var Direction = new THREE.Vector3();
var YDirection = new THREE.Vector3(0,1,0);

//Variables for speeds and distances etc
var distanceprev;
var frame = 0;
var xSpeed = 0.5;
var zSpeed = 0.5;
var ySpeed = 0;
var camstartx = 0;
var camstarty = 15;
var camstartz = 30;
var charstartx = -1955;
var charstarty = 300;
var charstartz = 1060;

//character data for jump and y height aswell as spawn position etc
chardata = {
	jump:true,
	x_vel:0,
	y_vel:0,
	z_vel:0,
	x:-1955,
	y:300,
	z:1060,
	rotationy:0
};
var character = new THREE.Object3D();

//Vectors

	 //rays in order to check for collisions
	 var forw = new THREE.Vector3(0, 0, -1); //Forward
	 var backw  = new THREE.Vector3(0,0,1); //back
	 var left = new THREE.Vector3(-1,0,0); //Left
	 var right = new THREE.Vector3(1,0,0); //Right
	 var downw = new THREE.Vector3(0, -1, 0); //Down

//raycasting
var rayforward = new THREE.Raycaster();
var raybackward = new THREE.Raycaster();
var raydown = new THREE.Raycaster();
var rayleft = new THREE.Raycaster();
var rayright = new THREE.Raycaster();

//Scene and camear etc
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 5000 );
renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
camera.position.set(camstartx,camstarty,camstartz);
//camera.lookAt(chardata.x,chardata.y,chardata.z);
camera.updateProjectionMatrix();
controls = new THREE.PointerLockControls(camera);

var position;//Ocean moveement
var time;


//char Vector3 another way to holde currect characters position in a vector
var charvec = new THREE.Vector3(chardata.x,chardata.y,chardata.z);


var fobj = new Array();
var bobj= new Array();
var dobj= new Array();
var lobj= new Array();
var robj= new Array();
var tp = new THREE.Vector3();

//Load crate test Model
// var cratebox = new THREE.Object3D();

init();
//to initialise the map and objects for the initial render(only called once)
function init(){

	clock = new THREE.Clock();

	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild(renderer.domElement );



	getarrMap1();
	Charinit(charstartx,charstarty,charstartz);

	 RPosList = gerrubyl3();
	 RubyArr = genruby(RPosList);
	 CPosList = getcoinl3();
	 CoinArr = gencoin(CPosList);
	 CurvyMap3();
	 SpinTopMap3();
	 //console.log(RPosList);


	for(let k =0 ;k<ObjectsMap1Arr.length;k++){
		scene.add(ObjectsMap1Arr[k] );
		Collidables.push(ObjectsMap1Arr[k]);
	}

	SetLight();
	controls.getObject().position.x = charstartx;
	controls.getObject().position.y = charstarty;
	controls.getObject().position.z = charstart;


}

//animate and render work hand in hand for rendering specific things
function animate() {
				requestAnimationFrame( animate );
				var delta = clock.getDelta();
				mixer.update( delta );
				TWEEN.update();
				sphereCamera.update(renderer,scene);

				//EVENTS (Allows game to scale when screen size is changed)
				THREEx.WindowResize(renderer, camera);	
				render();
			}


function render(){
	renderer.render(scene,camera);

	mushRender(mush_e1,-1860,955,35,35);
	mushRender(mush_e2,-1730,940,35,35);
	mushRender(mush_e3,-1662,1030,35,35);
	mushRender(mush_e4,-300,-527,390,390);

	spikesRender_y1(trapm3_1,300,85);
	spikesRender_y2(trapm3_2,300,85);
	spikesRender_y3(trapm3_3,300,85);

	if (spinTop1) spinTop1.rotation.y += 0.05;
	if (spinTop2) spinTop2.rotation.y += 0.05;
	if (spinTop3) spinTop3.rotation.y += 0.05;
	if (spinTop4) spinTop4.rotation.y += 0.05;
	if (spinTop5) spinTop5.rotation.y += 0.05;

	topRender1(top1,-1239,939,16,16);

	mushRender_zp1(mush_e5,890,200);
	mushRender_zp2(mush_e6,890,215);
	mushRender_zp3(mush_e7,890,215);
	mushRender_zp3(mush_e8,890,215);

	mushRender_zn1(mush_e9,1116,215);
	mushRender_zn2(mush_e10,1116,215);
	mushRender_zn3(mush_e11,1116,215);

};


controller = {
		forward:false,
		back:false,
		left:false,
		right:false,
		up:false,
		forwardUP: true,
		//fowardUP: true,
			keyListener:function(event){
				//var keystateUP = (event.type == "keyup")?true:false;

				var keystate = (event.type == "keydown")?true:false;
				switch (event.keyCode){
					case 87://the "W" key is pressed
							controller.forward = keystate;
							console.log("Character has just moved forward...");

							//controller.fowardUP = keystateUP;
							action.play();
							//action.stop();
						break;
					case 83://the "S" key is pressed
							controller.back = keystate;
						break;
					case 65://the "A" key is pressed
							controller.left = keystate;
						break;
					case 68://the "D" key is pressed
							controller.right = keystate;
						break;
					case 32://the spacebar is pressed
							controller.up = keystate;
						break;
				}

				if (controller.forward == false){
					action.stop();
				}

			}
}




loop = function(){

	checkruby();
	checkcoin();

	time = clock.getElapsedTime() * 5;

				position = oceanGeometry.attributes.position;

			 for ( let i = 0; i < position.count; i ++ ) {

				 var y = 5 * Math.sin( i / 5 + ( time + i ) / 7 );
				 position.setY( i, y );

			 }
			 for(let k = 0;k<CoinArr.length;k++){
				 CoinArr[k].rotateY(0.01);
			 }
			 for(let k = 0;k<RubyArr.length;k++){
				 RubyArr[k].rotateY(0.01);
			 }

			 position.needsUpdate = true;
 // onRender();


	distanceprev = chardata.y;
	colisiondetection(controls.getObject());
	if(controller.up && chardata.jump == false){

		//must be a mutiple of the gravity
		chardata.y_vel +=10;
		chardata.jump = true;
	}

	if(controller.left){
		// char.rotation.y-=0.04;
		// chardata.rotationy -= 0.04
		chardata.x_vel -=0.1;
	}
	if(controller.right){
		chardata.x_vel +=0.1;
		// char.rotation.y +=0.04;
		// chardata.rotationy += 0.04
	}
	if(controller.forward){
		chardata.z_vel -=0.12;//0.12
		action.play(); //need to figure out how controller event listener processes 'keyup' events to call action.stop() when 'W' is released

	}
	if(controller.back){
		chardata.z_vel +=0.06;
	}
	// if (!controller.forward){
	// 	act.enabled = false;
	// }

	chardata.y_vel -=0.4;//gravity(0.4)
	chardata.y += chardata.y_vel;
	chardata.x_vel *= 0.8;//friction
	chardata.y_vel *= 0.8;//friction
	chardata.z_vel *= 0.9;//friction




	/////////////////////Normal collisions
if(dobj.length != 0){
	if(dobj[0].distance>3){
		chardata.jump = true;
	}
	if(chardata.jump == true && dobj[0].distance<3 && distanceprev>chardata.y){
			chardata.jump = false;
	}
}
	if(chardata.y<-20){
		DeathCounter= DeathCounter+1;
		chardata.x=-1955;
		chardata.y=300;
		chardata.z=1060;
		chardata.jump = false;
		controls.getObject().position.set(charstartx,charstarty,charstartz);
	}
	if(chardata.jump == false && dobj.length != 0){
		chardata.jump = false;
		chardata.y = dobj[0].point.y+0.2;
}
	//forward collisions
	if(fobj.length != 0){
		if(fobj[0].distance < 2){
			chardata.jump = true;
			if(chardata.z_vel > 0){
				chardata.z_vel = chardata.z_vel*-1;
			}
			controls.getObject().position.z = fobj[0].point.z+2.2;
		}
	}
	//back collisions
	if(bobj.length != 0){
		if(bobj[0].distance < 2){
			chardata.jump = true;
			if(chardata.z_vel < 0){
				chardata.z_vel = chardata.z_vel*-1;
			}
			controls.getObject().position.z = bobj[0].point.z-2.2;
		}
	}
	//left collisions
	if(lobj.length != 0){
		if(lobj[0].distance < 2){
			chardata.jump = true;
			if(chardata.x_vel > 0){
				chardata.x_vel = 0;
			}
			controls.getObject().position.x = lobj[0].point.x+2.2;
		}
	}
	//right collisions
	if(robj.length != 0){
		if(robj[0].distance < 2){
			chardata.jump = true;
			if(chardata.x_vel < 0){
				chardata.x_vel = 0;
			}
			controls.getObject().position.x = robj[0].point.x-2.1;
		}
	}
/////////enemy collisions for each direction
if(efobj.length != 0){
	if(efobj[0].distance < 2){
		DeathCounter= DeathCounter+1;
		chardata.x=-1955;
		chardata.y=300;
		chardata.z=1060;
		chardata.jump = false;
		controls.getObject().position.set(charstartx,charstarty,charstartz);
	}
}else if(ebobj.length != 0){
	if(ebobj[0].distance < 1.5){
		DeathCounter= DeathCounter+1;
		chardata.x=-1955;
		chardata.y=300;
		chardata.z=1060;
		chardata.jump = false;
		controls.getObject().position.set(charstartx,charstarty,charstartz);
	}
}else if(elobj.length != 0){
	if(elobj[0].distance < 1.5){
		DeathCounter= DeathCounter+1;
		chardata.x=-1955;
		chardata.y=300;
		chardata.z=1060;
		chardata.jump = false;
		controls.getObject().position.set(charstartx,charstarty,charstartz);
	}
}else if(erobj.length != 0){
	if(erobj[0].distance < 1.5){
		DeathCounter= DeathCounter+1;
		chardata.x=-1955;
		chardata.y=300;
		chardata.z=1060;
		chardata.z_vel = 0;
		chardata.x_vel = 0;
		chardata.jump = false;
		controls.getObject().position.set(charstartx,charstarty,charstartz);
		}
	}//end of the level is reached when this block is touched
	if(((controls.getObject().position.x <= (End.position.x+11)) && (controls.getObject().position.x >= (End.position.x-11)) && (controls.getObject().position.z >= End.position.z-11) && (controls.getObject().position.z <= End.position.z+11))){
		document.getElementById('menu').style.visibility = 'visible';
		document.getElementById('scorecard').innerText = "Score: " + PointsCounter;
		document.getElementById('deathcount').innerText = "Deaths: " + DeathCounter;
		//wait five seconds and then route back to main menu
		window.setTimeout(function()
		{
			window.location.assign("index.html");
		},
		 5000);

	}

	Movechar(chardata.x,chardata.y,chardata.z);
	render();
  window.requestAnimationFrame(loop);
}


function colisiondetection(char){
		charvec.set(controls.getObject().position.x,controls.getObject().position.y,controls.getObject().position.z);
		//raycaster.set(pos , direc);
		rayforward.set(charvec , forw);//farward
		raybackward.set(charvec , backw);//back
		raydown.set(charvec , downw);//down
		rayleft.set(charvec , left);//left
		rayright.set(charvec , right);//right
		//.intersectObjects ( objects : Array, recursive : Boolean, optionalTarget : Array ) : Array

		//arrays of all collidable objects in a specific direction
		fobj = rayforward.intersectObjects(Collidables,true);
		bobj = raybackward.intersectObjects(Collidables,true);
		dobj = raydown.intersectObjects(Collidables,true);
		lobj = rayleft.intersectObjects(Collidables,true);
		robj = rayright.intersectObjects(Collidables,true);
		//arrays of all collidable objects in a specific direction
		efobj = rayforward.intersectObjects(EnemyList,true);
		ebobj = raybackward.intersectObjects(EnemyList,true);
		edobj = raydown.intersectObjects(EnemyList,true);
		elobj = rayleft.intersectObjects(EnemyList,true);
		erobj = rayright.intersectObjects(EnemyList,true);
};

//Sets Custom lights
function SetLight(){
	var light = new THREE.AmbientLight(0x404040);
	scene.add(light);

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
	directionalLight.position.set( 0,4,1 );
	directionalLight.castShadow = true;

	scene.add( directionalLight );
};

//Move Character
function Movechar(x1,y1,z1){
	controls.getObject().translateZ(chardata.z_vel);
	controls.getObject().translateX(chardata.x_vel);
	controls.getObject().position.y=chardata.y;
}


//Locks Mouse to screen
function OnMouseDown(event){
	if(!controls.isLocked){
		controls.lock();
	}
}
///Checks collisions with each Ruby
function checkruby(){
	for(let k = 0 ; k< RubyArr.length;k++){
		if((controls.getObject().position.x <= (RPosList[k].x+2) && controls.getObject().position.x >= (RPosList[k].x-2) && controls.getObject().position.z >= RPosList[k].z-2 && controls.getObject().position.z <= RPosList[k].z+2)&& scene.getObjectById(RubyArr[k].id,true) != null ){
			PointsCounter = PointsCounter+5;
			scene.remove(RubyArr[k]);

		}
	}
}

///Checks collisions with each coin
function checkcoin(){
	for(let k = 0 ; k< CoinArr.length;k++){
		if((controls.getObject().position.x <= (CPosList[k].x+2) && controls.getObject().position.x >= (CPosList[k].x-2) && controls.getObject().position.z >= CPosList[k].z-2 && controls.getObject().position.z <= CPosList[k].z+2)&& scene.getObjectById(CoinArr[k].id,true) != null){
			PointsCounter = PointsCounter+1;
			scene.remove(CoinArr[k]);

		}
	}
}

//Used with loading screen
function onTransitionEnd( event ) {

	const element = event.target;
	element.remove();

}

//Event Listeners:
window.addEventListener("keydown",controller.keyListener);
window.addEventListener("keyup",controller.keyListener);
window.addEventListener("mousedown",OnMouseDown,false);
window.requestAnimationFrame(loop);
