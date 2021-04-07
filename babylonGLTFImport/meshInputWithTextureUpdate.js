window.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById("canvas");
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function() {
        var scene = new BABYLON.Scene(engine);
        engine.enableOfflineSupport = false;
        var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(0), 10.0, BABYLON.Vector3.Zero(), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);

        var pbr = new BABYLON.PBRMaterial("pbr", scene);

        camera.keysLeft.push(45);
        camera.keysRight.push(45);

        //gltf loader 

        const modelLoadInput = document.getElementById("model-load");

        modelLoadInput.addEventListener("change", (event) => {
            let file = event.target.files[0];

            var url = URL.createObjectURL(file);
            BABYLON.SceneLoader.ImportMesh("", "", url, scene, function() {
                scene.createDefaultCamera(true, true, true);


            }, null, null, ".gltf");

            return url;
        });

        //glb loader
        const glbLoadInput = document.getElementById("glb-load");

        glbLoadInput.addEventListener("change", (event) => {
            let file = event.target.files[0];

            var lk = URL.createObjectURL(file)
            BABYLON.SceneLoader.ImportMesh("", "", lk, scene, function() {
                scene.createDefaultCamera(true, true, true);
            }, null, null, ".glb");

            return lk;
        });

        //delete all scenes
        $('.del_all').click(function() {
                for (var i = 0; i < scene.meshes.length; i++) {
                    scene.meshes[i].dispose();
                    i--;
                    envTexture.value = "";
                    modelLoadInput.value = "";
                    glbLoadInput.value = "";
                }
            })
            // add environment texture
        const envTexture = document.getElementById("env");

        envTexture.addEventListener("change", (event) => {

            let file = event.target.files[0];

            var path = URL.createObjectURL(file);
            pbr.environmentTexture = new BABYLON.HDRCubeTexture(path, scene, 512, false, false, false, false);
            scene.createDefaultSkybox(pbr.environmentTexture, false);
            return path;
        });

        //import diffuse map 

        var imgfile = document.getElementById('imgfile');
        const img = document.getElementById('img');

        img.addEventListener("change", (evt) => {
            let direct = evt.target.files[0];
            var url = URL.createObjectURL(direct);
            imgfile.src = url;
        })

        //import normal map

        var nrm = document.getElementById('nrm');
        const nrmImg = document.getElementById('nrmImg');
        nrmImg.addEventListener("change", (evt) => {

                let path = evt.target.files[0];
                var link = URL.createObjectURL(path);
                nrm.src = link;
            })
            //import metallicroughness map

        var mtlrough = document.getElementById("mtlrough");
        const mtlroughimg = document.getElementById('mtlroughimg');
        mtlroughimg.addEventListener("change", (evt) => {

            let search = evt.target.files[0];
            var ul = URL.createObjectURL(search);
            mtlrough.src = ul;
        })

        var startdrag = function(evt) {

            evt.dataTransfer.setData("text2", imgfile.src);
            evt.dataTransfer.setData("text3", nrm.src);
            evt.dataTransfer.setData("text4", mtlrough.src);

        }

        imgfile.addEventListener('dragstart', startdrag, false);

        var dragover = function(evt) {
            evt.preventDefault();
        }
        var drop = function(evt) {
            evt.preventDefault();

            var srce = evt.dataTransfer.getData("text2");
            var nrml = evt.dataTransfer.getData("text3");
            var rough = evt.dataTransfer.getData("text4");

            var pickResult2 = scene.pick(evt.offsetX, evt.offsetY);

            if (pickResult2.hit) {
                var texture = new BABYLON.Texture(srce, scene, true, false, 2);
                var nrmtexture = new BABYLON.Texture(nrml, scene, true, true, 2);
                var mtlroughtexture = new BABYLON.Texture(rough, scene, true, true, 2);

                pbr.bumpTexture = nrmtexture;
                pbr.albedoTexture = texture;
                pbr.metallicTexture = mtlroughtexture;
                pbr.useAlphaFromAlbedoTexture = true;
                pbr.useRoughnessFromMetallicTextureGreen = true;
                pbr.useMetallnessFromMetallicTextureBlue = true;
                pbr.useAlphaFromAlbedoTexture = true;
                pbr.sheen.isEnabled = true;
                pickResult2.pickedMesh.material = pbr;

            }
        }

        if (canvas) {
            canvas.addEventListener('dragover', dragover, false);
            canvas.addEventListener('drop', drop, false);
        }



        $('.del_texture').click(function() {

            imgfile.src = "";
            nrm.src = "";
            mtlrough.src = "";

            img.value = "";
            imgfile.value = "";
            nrm.value = "";
            nrmImg.value = "";
            mtlrough.value = "";
            mtlroughimg.value = "";
        })

        //screenshot
        $('.snshot').click(function() {
            scene.render();
            BABYLON.Tools.CreateScreenshot(engine, camera, { width: 1024, height: 1024 });
        })

        return scene;
    }
    var scene = createScene();
    engine.runRenderLoop(function() {
        scene.render();
    })
});