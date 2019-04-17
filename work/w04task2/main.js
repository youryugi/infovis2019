function main()
{
    var width = 500;
    var height = 500;

    var scene = new THREE.Scene();

    var fov = 45;
    var aspect = width / height;
    var near = 1;
    var far = 1000;
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 5 );
    scene.add( camera );
    function guang()
    {var light = new THREE.SpotLight(0xffffff)
    light.position.set(1, 1, 1)
    light.target = floor; // 投射方向指向地板
    light.castShadow = true; // 用于产生阴影
    scene.add(light)}
    function wenli()
    {cube.castShadow = true; 
    // 对floor接受阴影
    floor.receiveShadow = true;
    // 光源设置
    light.castShadow = true;
    // 光源的阴影设置
    //light.shadow.mapSize.width = 512;  // default
    //light.shadow.mapSize.height = 512; // default     light.shadow.camera.near = 0.5;       // default
    //light.shadow.camera.far = 500      // default
        }
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    guang();
    loop();
    wenli();

    function loop()
    {
        requestAnimationFrame( loop );
        cube.rotation.x += 0.001;
        cube.rotation.y += 0.001;
        renderer.render( scene, camera );
    }
}
