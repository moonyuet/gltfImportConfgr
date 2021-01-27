window.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById("canvas");
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function() {
        var scene = new BABYLON.Scene(engine);
        engine.enableOfflineSupport = false;
        var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(0), 10.0, BABYLON.Vector3.Zero(), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);

        var pbr = new BABYLON.PBRMetallicRoughnessMaterial("pbr", scene);

        camera.keysLeft.push(45);
        camera.keysRight.push(45);



        //gltf loader

        const modelLoadInput = document.getElementById("model-load");

        modelLoadInput.addEventListener("change", (event) => {
            let file = event.target.files[0];

            var url = URL.createObjectURL(file)
            BABYLON.SceneLoader.ImportMesh("", "", url, scene, function(mesh) {
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

            var path = URL.createObjectURL(file)
            pbr.environmentTexture = new BABYLON.HDRCubeTexture(path, scene, 512, false, false, false, false);
            scene.createDefaultSkybox(pbr.environmentTexture, false);
            return path;
        });

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