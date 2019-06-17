var volume = new KVS.LobsterData();
var screen = new KVS.THREEScreen();
var cmap = [];
var currentOperation = 1;
var surfaces;
var currentTransfer = 1;
var currentMaterial = 3;
var currentShape = 1;
var currentColor = "0xFFD700";

$('#colorinput').hide();
$('#lbl').hide();
function main()
{

    transfer(currentTransfer,1); 

    screen.init( volume, {
        width: window.innerWidth*0.8,
        height: window.innerHeight,
        targetDom: document.getElementById('target'),
        enableAutoResize: false
    });
    
    if(currentMaterial != 1)
    {
        var light = new THREE.PointLight();
        light.position.set( 0, 0, 5 );
        screen.scene.add(light);
    }
    var bounds = Bounds( volume );
    screen.scene.add( bounds );
    
    if(currentOperation == 1)
    {
        surfaces = null;
        var value = document.getElementById("iso").value;
        surfaces = Isosurfaces(volume, parseInt(value), cmap, currentMaterial, currentShape);
        
       
    }
    else
    {

        var n1 = parseFloat($('#normal1 option:selected').text());
        var n2 = parseFloat($('#normal2 option:selected').text());
        var n3 = parseFloat($('#normal3 option:selected').text());
        if((n1 == 0 && n2 == 0) && n3 == 0)
        {
            alert("Normal vector cannot have length 0. I will calculate with vector (0,0,1)");
            n3 = 1;
        }
        surfaces = null;
        var point = new THREE.Vector3(60,60,17);
        var normal = new THREE.Vector3(n1,n2,n3);
        surfaces = SlicePlane( volume, point, normal, currentTransfer, currentShape, currentMaterial);
    }
    screen.scene.add( surfaces );
    surfaces.material.side = THREE.DoubleSide;
    if(currentShape != 1)
    {
        surfaces.material.color.setHex( currentColor);
        if(currentShape == 2)
            surfaces.scale.set( 25, 25, 25 );
        else    
            surfaces.scale.set( 2, 2, 2 );
        surfaces.position.setX(60);
        surfaces.position.setY(70); 
        surfaces.position.setZ(10); 
    }
    screen.renderer.setClearColor( 0xffffff, 1);
    document.addEventListener( 'mousemove', function() {
        screen.light.position.copy( screen.camera.position );
    });


    window.addEventListener( 'resize', function() {
        screen.resize( [ window.innerWidth, window.innerHeight ] );
    });

    screen.loop();
}


function calculate()
{
    $('canvas').remove();
    currentOperation = 1;

    main();
}

function slice()
{
     $('canvas').remove();
     currentOperation = 2;
     main();
}

$('#colorinput').on('input', function() {

    currentColor = jQuery(this).val().replace("#","0x");
    surfaces.material.color.setHex( currentColor );
});

$("#transfer").change(function() {
    if(this.checked) {
        
        $("#colorinput").prop("disabled", true);
        $("#colormaps").show();
    }
    else
    {

        $("#colorinput").prop("disabled", false);
        $("#colorinput")[0].click();
        $("#colormaps").hide();
    }
});

function move()
{

	surfaces.position.setX(parseInt(document.getElementById("movex").value));
	surfaces.position.setY(parseInt(document.getElementById("movey").value));
	surfaces.position.setZ(parseInt(document.getElementById("movez").value));
}

function reset()
{
	surfaces.position.setX(0);
	surfaces.position.setY(0); 
	surfaces.position.setZ(0); 
}


function transfer(c,method)
{
    cmap = [];
    currentTransfer = c;
    switch(c)
    {
        case 1:
            for ( var i = 0; i < 256; i++ )
            {
                var S = i / 255.0; // [0,1]
                var R = 1-Math.max( Math.cos( ( S - 1.0 ) * Math.PI ), 0.0 );
                var G = 1-Math.max( Math.cos( ( S - 0.5 ) * Math.PI ), 0.0 );
                var B = 1-Math.max( Math.cos( S * Math.PI ), 0.0 );
                var color = new THREE.Color( R, G, B );
                cmap.push( [ S, '0x' + color.getHexString() ] );
            }
        break;
        case 2:
            for ( var i = 0; i < 256; i++ )
            {
                var S = i / 255.0; // [0,1]
                var R = Math.max( Math.cos( ( S - 1.0 ) * Math.PI ), 0.0 );
                var G = Math.max( Math.cos( ( S - 0.5 ) * Math.PI ), 0.0 );
                var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
                var color = new THREE.Color( R, G, B );
                cmap.push( [ S, '0x' + color.getHexString() ] );
            }
        break;
        case 3:
            for ( var i = 0; i < 256; i++ )
            {
                var S = i / 255.0; // [0,1]
                var R = 1;
                var G = Math.max( Math.cos(  S * Math.PI/2 ), 0.0 );
                var B = Math.max( Math.cos(  S * Math.PI/2 ), 0.0 );
                var color = new THREE.Color( R, G, B );
                
                cmap.push( [ S, '0x' + color.getHexString() ] );
            }
        break;
        case 4:
            for ( var i = 0; i < 256; i++ )
            {
                var S = i / 255.0; // [0,1]
                var R = Math.max(0.5 - Math.max( Math.cos( ( S - 1.0 ) * Math.PI ), 0.0 ),0.0);
                var G = Math.max(0.5 - Math.max( Math.cos( ( S - 0.5 ) * Math.PI ), 0.0 ),0.0);
                var B = Math.max(0.5 - Math.max( Math.cos( S * Math.PI ), 0.0 ),0.0);
                var color = new THREE.Color( R, G, B );
                cmap.push( [ S, '0x' + color.getHexString() ] );
            }
            break;
    }
    if(method == 2)
    {
        $('canvas').remove();
        main();
    }
    
     
}

$( function() {
                
                $( '#cd-dropdown' ).dropdown( {
                    gutter : 5,
                    delay : 100,
                    random : true,
                    onOptionSelect: function(opt){
                        switch(opt.text())
                        {
                            case "MeshBasicMaterial": 
                            currentMaterial = 1;
                            break;
                            case "MeshLambertMaterial": 
                            currentMaterial = 2;
                            break;
                            case "MeshPhongMaterial": 
                            currentMaterial = 3;
                            break;
                        }
                        $('canvas').remove();
                        main();
                    }
                } );

            });

            $( function() {
                
                $( '#cd-dropdown1' ).dropdown( {
                    gutter : 5,
                    delay : 100,
                    random : true,
                    onOptionSelect: function(opt){
                        
                        switch(opt.text())
                        {
                            case "Lobster": 
                            $('#colormaps1').show();
                            $('#trf').show();
                            $('#colorinput').hide();
                            $('#lbl').hide();
                            currentShape = 1;
                            break;
                            case "Cube": 
                            $('#colormaps1').hide();
                            $('#trf').hide();
                            $('#colorinput').show();
                            $('#lbl').show();
                            currentShape = 2;
                            break;
                            case "Star": 
                            $('#colormaps1').hide();
                            $('#trf').hide();
                            $('#colorinput').show();
                            $('#lbl').show();
                            currentShape = 3;
                            break;
                        }
                        $('canvas').remove();
                        main();
                    }
                } );

            });

           




