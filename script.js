import {
    FaceDetector,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const camera = document.getElementById("camera");
const mensagem = document.getElementById("mensagem");
const botaoCamera = document.getElementById("botaoCamera");

let detector;
let cameraLigada = false;

async function carregarDetector() {
    mensagem.innerHTML = "Carregando o detector de rosto...";

    const vision =
        await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

    detector =
        await FaceDetector.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"
                },
                runningMode: "VIDEO"
            }
        );

    mensagem.innerHTML = "Detector carregado!";
}

async function abrirCamera() {
    try {
        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: true
            });

        camera.srcObject = stream;
        cameraLigada = true;

        function detectarRosto() {
            if (!cameraLigada) {
                return;
            }

            if (camera.readyState >= 2 && detector) {

                const resultado =
                    detector.detectForVideo(
                        camera,
                        performance.now()
                    );

                if (resultado.detections.length > 0) {
                    mensagem.innerHTML = "Rosto identificado: acesso permitido";
                } else {
                    mensagem.innerHTML = "Nenhum rosto identificado: acesso negado";
                }
            }

            requestAnimationFrame(
                detectarRosto
            );
        }

        requestAnimationFrame(
            detectarRosto
        );

    } catch (erro) {
        console.error("Erro ao abrir a câmera: acesso negado", erro);

        mensagem.innerHTML =
            "Não foi possível acessar a câmera.";
    }
}

botaoCamera.addEventListener(
    "click",
    abrirCamera
);

carregarDetector();