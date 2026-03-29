# Audio CNN Classifier & Visualizer 

[![Model Accuracy](https://img.shields.io/badge/Model%20Accuracy-83.4%25-brightgreen.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-15-blue.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0-orange.svg)](https://pytorch.org/)
[![Modal](https://img.shields.io/badge/Modal-Serverless-red.svg)](https://modal.com/)

**Production-ready audio-CNN classification** trained on **ResNet architecture** which i **created from scratch**, then trained the model on **ESC-50 DATASET** achieving **83.4% accuracy**. Live **feature map visualization**, **ResNet-50**, **Modal serverless**, **TensorBoard**, **React.js**.

---

##  Features

- **83.4% Top-1 Accuracy** on ESC-50 (50 environmental sounds)
- **Live Feature Maps** - Watch ResNet-50 layers activate
- **Real-time Waveform** + Mel Spectrogram visualization
- **50-class Emoji Support** 🐦👏🚁🔨 (chirping_birds, clapping, etc.)
- **Modal A10G GPU** serverless inference (~45ms)
- **Next.js 15 App Router** + React 19 + TypeScript + shadcn/ui + Tailwind CSS 4
- **Base64 WAV** upload → instant predictions
---
##  Performance

| Metric | Value |
|--------|-------|
| **Top-1 Accuracy** | **83.4%** |
| Inference Time | **45ms** (A10G) |
| Classes | 50 |
| Input Length | 5s WAV (44.1kHz) |
| Spectrogram | 128 mel bins |

---

**Sample Output (clapping.wav):**
👏 clapping: 81.63%
👣 footsteps: 18.36%
🥫 can_opening: 0.01%

---
#  UI Components

![UI Demo 1](UIDemos/Screenshot%202026-02-02%20035446.png)

![UI Demo 2](UIDemos/Screenshot%202026-02-02%20035458.png)  

![UI Demo 3](UIDemos/Screenshot%202026-02-02%20035507.png)

![UI Demo 4](UIDemos/Screenshot%202026-02-02%20035517.png)

---

## From-Scratch ResNet-50

**100% custom implementation** (no torchvision):

✅ ResidualBlock: conv→BN→ReLU + dynamic 1×1 shortcut
✅ Pre-activation ordering (BN→ReLU→Conv)
✅ ModuleList for feature map collection
✅ Exact ResNet-50: 3-4-6-3 blocks,
64→128→256→512 channels
✅ Audio-specific: 1ch input, AdaptiveAvgPool2d(1,1)


---

##  Architecture

**ResNet-50 for Audio Spectrograms** (3-4-6-3 blocks):

`Conv1(7×7,64) → Layer1(3×64ch) → Layer2(4×128ch) → Layer3(6×256ch) → Layer4(3×512ch)`
↓
`AdaptiveAvgPool2d → Dropout(0.5) → FC(512→50) → Softmax`

--- 
**Audio Pipeline:**
`WAV → Mono → Resample(44.1kHz) → MelSpec(n_mels=128,n_fft=1024,hop=512) → dB → ResNet`

---

##  Quick Start

```bash
git clone https://github.com/harshit7271/Audio-CNN-Classifier-Project.git
cd Audio-CNN-Classifier-Project
```

### Backend (Modal)
```bash
pip install -r requirements.txt
modal token set
modal volume put esc-model best_model.pth
modal deploy main.py
```

### Frontend
```bash
cd audio-cnn-frontend
pnpm install
pnpm dev
```

**Frontend Stack:**
- **Next.js 15.2.3** - App Router with Turbo mode
- **React 19.0.0** - Latest React with concurrent features
- **TypeScript 5.8.2** - Strict type checking
- **Tailwind CSS 4.0.15** - Utility-first styling
- **shadcn/ui** - Accessible component library (Badge, Button, Card, Progress)
- **Radix UI** - Unstyled, accessible primitives
- **T3 Stack** - Type-safe environment validation
- **Geist Font** - Modern typography

---
## Structure
```
├── audio-cnn-frontend/              # Next.js 15 + React 19 (T3 Stack)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx             # Main page with file upload & visualization
│   │   │   └── layout.tsx           # Root layout with Geist font
│   │   ├── components/
│   │   │   └── ui/
│   │   │       ├── FeatureMap.tsx   # SVG-based feature map visualization
│   │   │       ├── Waveform.tsx     # Audio waveform SVG renderer
│   │   │       ├── ColorScale.tsx   # Gradient color legend
│   │   │       ├── badge.tsx        # shadcn/ui Badge component
│   │   │       ├── button.tsx       # shadcn/ui Button component
│   │   │       ├── card.tsx         # shadcn/ui Card component
│   │   │       └── progress.tsx     # shadcn/ui Progress component
│   │   ├── lib/
│   │   │   ├── utils.ts             # cn() utility (clsx + tailwind-merge)
│   │   │   └── colors.ts            # Feature map color mapping (RGB gradients)
│   │   ├── styles/
│   │   │   └── globals.css          # Tailwind CSS imports
│   │   └── env.js                   # T3-OSS environment validation
│   ├── public/
│   │   └── favicon.ico
│   ├── package.json                 # Dependencies & scripts
│   ├── tsconfig.json                # TypeScript config (path aliases: ~/*)
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   └── components.json              # shadcn/ui configuration

├── backend/                         # Modal + PyTorch
│   ├── main.py                      # FastAPI + AudioClassifier endpoint
│   ├── train.py                     # Training script
│   ├── model.py                     # ResNet-50 (16 blocks)
│   ├── requirements.txt             # Python dependencies
│   └── best_model.pth               # 83.4% checkpoint (on Modal volume)
│
├── tensorboard_logs/                # Training logs
│   └── run_*/                       # TensorBoard event files
│
├── UIDemos/                         # UI screenshots
│   └── Screenshot*.png
│
└── README.md
```

---

# Code Highligths
### Backend(main.py)
```python
# Base64 → WAV → MelSpec → ResNet → Feature Maps
audio_bytes = base64.b64decode(request.audio_data)
spectrogram = MelSpectrogram(sample_rate=44100, n_mels=128)
output, feature_maps = model(spectrogram, return_feature_maps=True)
```

## Frontend (Next.js 15 + React 19)
```tsx
// File upload → Base64 encoding → API call
const reader = new FileReader();
reader.readAsArrayBuffer(file);
reader.onload = async () => {
  const arrayBuffer = reader.result as ArrayBuffer;
  const base64String = btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte), ""
    )
  );
  
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audio_data: base64String })
  });
  
  const { predictions, visualization, input_spectrogram, waveform } = 
    await response.json();
};

// Layer splitting for visualization
function splitLayers(visualization) {
  const main = [];      // Top-level layers (conv1, layer1, etc.)
  const internals = {}; // Internal layers (layer1.0.conv1, etc.)
  // Groups layers by parent block for nested visualization
}
```

**Frontend Features:**
- **Client-side WAV upload** with FileReader API
- **Base64 encoding** for audio transmission
- **Real-time feature map visualization** via SVG rendering
- **Interactive layer exploration** (main layers + internal block layers)
- **Top 3 predictions** with confidence progress bars
- **50-class emoji mapping** (ESC-50 categories)
- **Responsive grid layout** (Tailwind CSS)
- **Color-coded feature maps** (blue→white→orange gradient)
- **Waveform visualization** (SVG path rendering)
- **Error handling** with user-friendly messages
- **Loading states** during API inference
---

# Key Features
- GPU Autoscaling - Modal scales to zero

- NaN Handling - `torch.nan_to_num()` for robust inference

- Stereo→Mono - `np.mean(audio_data, axis=1)`

- Waveform Downsampling - Max 8000 samples for viz

- **Layer Splitting** - `splitLayers()` groups main layers vs internal block layers for nested visualization
- **ESC-50 Emojis** - 50-class mapping (🐕🌧️👶🚪 etc.) with fallback icons
- **SVG-based Visualizations** - FeatureMap & Waveform use scalable SVG rendering
- **Color Gradient Mapping** - Custom RGB interpolation for feature map values (-1 to +1)
- **Responsive Design** - Mobile-friendly grid layouts with Tailwind CSS
- **Type Safety** - Full TypeScript coverage with strict mode enabled
- **Path Aliases** - `~/*` imports for cleaner code organization

---
# Training
```bash
Dataset: ESC-50 (2000 clips, 5s, 44.1kHz)
Splits: 5-fold CV (Fold 5 = test)
Best: Epoch 100, Val Acc: 83.4%
```



---
# License
MIT - Use freely!

