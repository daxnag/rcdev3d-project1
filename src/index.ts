import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    timeout,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    DiamondPlugin,
    FrameFadePlugin,
    GLTFAnimationPlugin,
    GroundPlugin,
    BloomPlugin,
    TemporalAAPlugin,
    AnisotropyPlugin,
    GammaCorrectionPlugin,

    addBasePlugins,
    ITexture, TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,
    MeshBasicMaterial2,
    IViewerPlugin,
    mobileAndTabletCheck,
    Color, // Import THREE.js internals
    Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from '@studio-freight/lenis'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
})

function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  
requestAnimationFrame(raf)

gsap.registerPlugin(ScrollTrigger)

async function setupViewer(){

    const isMobile = mobileAndTabletCheck()

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
    })

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target
    const exitButton = document.querySelector('.button--exit') as HTMLElement
    const customizerInterface = document.querySelector('.customizer--container') as HTMLElement

    // Add a popup(in HTML) with download progress when any asset is downloading.
    await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    // or use this to add all main ones at once.
    await addBasePlugins(viewer)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    //await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})

    await manager.addFromPath("./assets/datsun.glb")

    const carColor = manager.materials!.findMaterialsByName('Material.001')[0] as MeshBasicMaterial2;
    

    let needsUpdate = true;

    onUpdate();

    window.scrollTo(0,0);

    function setUpScrollAnimation() {
        const tl = gsap.timeline();

        tl.to(position, {
                    x: 1.8443456803, 
                    y: 1.6641108491,
                    z: 7.7814655028,
                    scrollTrigger: {
                        trigger: ".second",
                        start: "top bottom",
                        end: "top top",
                        scrub: true,
                        immediateRender: false
                    },
                    onUpdate
        })

        .to(target, {x: -1.4966902905, y: -0.1016753222, z: -0.1569569429,
            scrollTrigger: {
                trigger: ".second",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }})        

        gsap.to('.second-container', {
            opacity: 1,
            duration: 1.5,
            scrollTrigger: {
                trigger: ".second",
                start: 'top 70%',
                end: "top top",
                scrub: true
        }
        })
                
        tl.to(position, {
            x: -3.2343582239, 
            y: 1.8475005786,
            z: 7.1559944453,
            scrollTrigger: {
                trigger: ".third",
                start:"top bottom",
                end: "top top",
                scrub: true,
                immediateRender: false
            },
            onUpdate
        })    
        
        tl.to(target, {x: 0.7568401408, y: 0.1152113734, z: 0.9847750549,
            scrollTrigger: {
                trigger: ".third",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }})  

        gsap.to('.third-container', {
            opacity: 1,
            duration: 1,
            scrollTrigger: {
                trigger: ".third",
                start: 'top 95%',
                scrub: true
        }
        })

        tl.to(position, {
            x: -3.2055387161, 
            y: 0.7026381468,
            z: -5.4921740888,
            scrollTrigger: {
                trigger: ".fourth",
                start:"top bottom",
                end: "top top",
                scrub: true,
                immediateRender: false
            },
            onUpdate
        })    
        
        tl.to(target, {x: 0.8998738046, y: -0.1209717878, z: 0.7912719239,
            scrollTrigger: {
                trigger: ".fourth",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }})  

        gsap.to('.fourth-container', {
            opacity: 1,
            duration: 1,
            scrollTrigger: {
                trigger: ".fourth",
                start: 'top 20%',
                end: 'top top',
                scrub: true
        }
        })
    }

    setUpScrollAnimation();

    function onUpdate() {
        needsUpdate = true;
        //viewer.renderer.resetShadows();
        viewer.setDirty()
    }

    function changeColor(_colorToBeChanged: Color){
        carColor.color = _colorToBeChanged;
        viewer.scene.setDirty()
    }

    viewer.addEventListener('preFrame', () => {
        if(needsUpdate) {
            camera.positionUpdated(true);
            camera.targetUpdated(true);
            needsUpdate = false;    
        }
    })

    const sections = document.querySelector('.container') as HTMLElement
    const mainContainer = document.getElementById('webgi-canvas-container') as HTMLElement

    let withChin = true;
    let withTint = true;

	document.querySelector('.customize')?.addEventListener('click', () => {
        withChin = true;
        withTint = true;
        sections.style.display = "none"
        mainContainer.style.pointerEvents = "all"
        document.body.style.cursor = "grab"
        lenis.stop()

        gsap.to(position, {x: 4.3770095524, y: 0.3243038865, z: 4.6047695798, duration: 2, ease: "power3.inOut", onUpdate})
        gsap.to(target, {x: 0, y: 0 , z: 0, duration: 2, ease: "power3.inOut", onUpdate, onComplete: enableControllers})
	})

    document.querySelector('.button--colors.blue')?.addEventListener('click', () => {
		changeColor(new Color(0x0f4290).convertSRGBToLinear())
    })

    document.querySelector('.button--colors.red')?.addEventListener('click', () => {
		changeColor(new Color(0xd20a0a).convertSRGBToLinear())
    })

    document.querySelector('.button--colors.orange')?.addEventListener('click', () => {
		changeColor(new Color(0xdd7911).convertSRGBToLinear())
    })

    document.querySelector('.button--colors.white')?.addEventListener('click', () => {
		changeColor(new Color(0xffffff).convertSRGBToLinear())
    })

    const chinBtn = document.querySelector('.no-chin');
    const tintBtn = document.querySelector('.no-tint');
    
    chinBtn?.addEventListener('click', (e) => {
        if(withChin) {
            chinBtn.innerHTML = 'With Chin';
        } else {
            chinBtn.innerHTML = 'No Chin';
        }
        withChin = !withChin;
        let chin = viewer.scene.findObjectsByName('Object_16');
        chin[0].visible = withChin;
        viewer.scene.setDirty();
    });

    tintBtn?.addEventListener('click', (e) => {
        if(withTint) {
            tintBtn.innerHTML = 'With Tint';
        } else {
            tintBtn.innerHTML = 'No Tint';
        }
        withTint = !withTint;
        let tint = viewer.scene.findObjectsByName('Object_18');
        tint[0].visible = withTint;
        viewer.scene.setDirty();
    });

    exitButton.addEventListener('click', () => {
        gsap.to(position, {
            x: -3.2055387161, 
            y: 0.7026381468,
            z: -5.4921740888, 
            duration: 2, ease: "power3.inOut", 
        onUpdate})
        gsap.to(target, {x: 0.8998738046, y: -0.1209717878, z: 0.7912719239, duration: 2, ease: "power3.inOut", onUpdate})
        
        changeColor(new Color(0x0f4290).convertSRGBToLinear())

        viewer.scene.findObjectsByName('Object_16')[0].visible = true;
        viewer.scene.findObjectsByName('Object_18')[0].visible = true;
        
        viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})
        sections.style.display = "contents"
        mainContainer.style.pointerEvents = "none"
        document.body.style.cursor = "default"
        exitButton.style.display = "none"
        customizerInterface.style.display = "none"
        lenis.start()
        window.scrollTo(0, document.body.scrollHeight);    
	})

    function enableControllers(){
        exitButton.style.display = "block"
        customizerInterface.style.display = "block"
        viewer.scene.activeCamera.setCameraOptions({controlsEnabled: true})
    }


}

setupViewer()
