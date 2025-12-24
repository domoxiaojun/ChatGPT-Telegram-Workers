# Complete Guide to Image Editing Features

**Last Updated:** 2025-12-20

---

## Quick Start

### Supported Agents

| Agent | Generation | Editing | Mask | Edit Mode | New Features | Recommended Use Cases |
|-------|-----------|---------|------|-----------|-------------|---------------------|
| **Google** | ✅ | ✅ | ❌ | Implicit | 4K resolution, Google Search | Quick editing, real-time data visualization |
| **Vertex** | ✅ | ✅ | ✅ | 6 explicit modes | - | Professional editing, precise control |
| **OpenAI** | ✅ | ✅ | ✅ | Implicit | - | Balanced performance, DALL-E 3 generation |
| **xAI** | ✅ | ❌ | ❌ | - | - | Generation only (up to 10 images) |

### Telegram Usage

```
# Generate image
/img a cute dog in a garden

# Edit image (reply to an image)
[Reply to image] /img make it more colorful
```

---

## 1. Google Generative AI

### Configuration
```env
GOOGLE_API_KEY=your-api-key
GOOGLE_IMAGE_MODEL=gemini-2.5-flash-image

# Gemini 3 Pro Image new features (gemini-3-pro-image-preview)
GOOGLE_IMAGE_MODEL=gemini-3-pro-image-preview

# Optional: Aspect ratio setting ("1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9")
GOOGLE_IMAGE_ASPECT_RATIO=16:9

# Optional: Resolution setting ("1K", "2K", "4K")
GOOGLE_IMAGE_SIZE=4K

# Optional: Enable Google Search grounding (real-time data: weather, stocks, news)
GOOGLE_IMAGE_ENABLE_GOOGLE_SEARCH=true
```

### Features
- ✅ Simple and fast
- ✅ Conversational iterative editing
- ✅ Multi-image composition (up to 14 images)
- ❌ No mask support

### Gemini 3 Pro Image New Features ⭐
**Model:** `gemini-3-pro-image-preview`

#### High-Resolution Output
- Supports **1K, 2K, 4K** three resolutions
- Optimized for professional asset production
- Token consumption: 1K ≈ 1120 tokens, 4K ≈ 2000 tokens

#### Flexible Aspect Ratios
Supports 10 aspect ratios:
- Square: `1:1`
- Portrait: `2:3`, `3:4`, `4:5`, `9:16`
- Landscape: `3:2`, `4:3`, `5:4`, `16:9`, `21:9`

#### Google Search Grounding (Real-time Data)
When enabled, generate images based on real-time information:
- 📰 Current news events
- 🌤️ Real-time weather maps
- 📈 Latest stock charts
- 🗺️ Geographic data visualization

```env
GOOGLE_IMAGE_ENABLE_GOOGLE_SEARCH=true
```

Example prompts:
```
/img Generate an infographic about today's weather forecast in Taipei
/img Create a chart showing Tesla stock prices from the past week
/img Make an infographic about AI development in 2025
```

#### Advanced Text Rendering
- Generate clear, stylized text
- Suitable for: infographics, menus, charts, marketing materials

#### Thinking Mode
- Model performs a "thinking" process
- Generates intermediate "thinking images" (visible in backend, not billed)
- Optimizes final high-quality output

#### More Reference Images
- Supports up to **14 reference images**
- Can mix: up to 6 objects + 5 people images

### Usage Examples
```
# Basic editing
[Reply to image] /img make the colors more vibrant
[Reply to image] /img change the background to a beach

# Gemini 3 Pro Image - High resolution + aspect ratio
# Config: GOOGLE_IMAGE_SIZE=4K, GOOGLE_IMAGE_ASPECT_RATIO=16:9
/img a panoramic view of a futuristic tech city

# Google Search - Real-time data
# Config: GOOGLE_IMAGE_ENABLE_GOOGLE_SEARCH=true
/img Create an infographic showing today's global major stock market performance
/img Generate a visualization chart of the latest AI technology trends
```

### Model Comparison

| Feature | gemini-2.5-flash-image | gemini-3-pro-image-preview |
|---------|----------------------|---------------------------|
| Generation/Editing | ✅ | ✅ |
| Resolution | Default | 1K/2K/4K options |
| Aspect Ratio | Limited | 10 choices |
| Google Search | ❌ | ✅ |
| Advanced Text | Basic | Professional |
| Thinking Mode | ❌ | ✅ |
| Reference Images | 14 images | 14 images (6 objects + 5 people) |
| Recommended Scenarios | Quick iteration | Professional asset creation |

---

## 2. Vertex AI (Most Powerful)

### Configuration
```env
VERTEX_PROJECT_ID=your-project-id
VERTEX_IMAGE_MODEL=imagen-3.0-capability-001  # For editing only
VERTEX_CREDENTIALS={"client_email":"...","private_key":"..."}
```

### Smart Model Selection

The code **automatically selects** the correct model:
- Has reference images → Forces `imagen-3.0-capability-001` (only model supporting editing)
- Pure generation → Uses configured model (can be `imagen-4.0-fast-generate-001`)

### Model Comparison

| Model | Editing | Generation | Recommended Use |
|-------|---------|-----------|----------------|
| **imagen-3.0-capability-001** | ✅ | ✅ | **Must use for editing** |
| imagen-4.0-fast-generate-001 | ❌ | ✅ | Fast generation (no editing support) |

### 6 Editing Modes

#### Smart Default Mode Selection
- **With mask image**: Defaults to `EDIT_MODE_INPAINT_INSERTION` (precise inpainting)
- **Without mask image**: Defaults to `EDIT_MODE_CONTROLLED_EDITING` (general controlled editing)

#### 1. EDIT_MODE_CONTROLLED_EDITING (Telegram Default)
General controlled editing, no mask needed
```json
{
  "agent": "vertex",
  "prompts": ["change the background to blue"],
  "referenceImages": ["base64..."],
  "editMode": "EDIT_MODE_CONTROLLED_EDITING"
}
```

#### 2. EDIT_MODE_INPAINT_INSERTION (Default with mask)
Insert new objects or content (requires mask)
```json
{
  "agent": "vertex",
  "prompts": ["add a red apple on the table"],
  "referenceImages": ["base64..."],
  "editMode": "EDIT_MODE_INPAINT_INSERTION",
  "mask": "base64_mask"
}
```

#### 3. EDIT_MODE_INPAINT_REMOVAL
Remove objects
```json
{
  "editMode": "EDIT_MODE_INPAINT_REMOVAL",
  "prompts": ["remove all people from the image"]
}
```

#### 4. EDIT_MODE_OUTPAINT
Extend image boundaries
```json
{
  "editMode": "EDIT_MODE_OUTPAINT",
  "prompts": ["extend to the right, add more forest"]
}
```

#### 5. EDIT_MODE_PRODUCT_IMAGE
Product image optimization
```json
{
  "editMode": "EDIT_MODE_PRODUCT_IMAGE",
  "prompts": ["place the product on a white background"]
}
```

#### 6. EDIT_MODE_BGSWAP
Background replacement
```json
{
  "editMode": "EDIT_MODE_BGSWAP",
  "prompts": ["change the background to a beach sunset"]
}
```

### Advanced Parameters

#### maskMode (Mask Mode)
- `MASK_MODE_USER_PROVIDED` - Manually provided mask
- `MASK_MODE_DETECTION_BOX` - Auto-detect bounding box
- `MASK_MODE_CLOTHING_AREA` - Clothing area segmentation
- `MASK_MODE_PARSED_PERSON` - Human parsing

#### maskDilation (Mask Dilation)
```json
{
  "maskDilation": 0.01  // 0-1, recommended 0.01
}
```

#### negativePrompt (Negative Prompt)
```json
{
  "negativePrompt": "blurry, low quality, distorted, extra limbs"
}
```

#### baseSteps (Generation Steps)
```json
{
  "baseSteps": 60  // 35-75, higher is better quality
}
```

### Mask Creation

Mask is a black and white image:
- **White (255,255,255)** = Area to edit
- **Black (0,0,0)** = Keep unchanged

---

## 3. OpenAI/DALL-E

### Configuration
```env
OPENAI_API_KEY=your-api-key
DALL_E_MODEL=dall-e-2  # or dall-e-3, gpt-image-1
```

### Smart Model Selection

The code **automatically adjusts**:
- dall-e-3 editing → Auto-downgrades to dall-e-2
- Other models → Uses as configured

### Supported Models

| Model | Editing | Generation | Max Per Request | Recommended |
|-------|---------|-----------|----------------|------------|
| dall-e-2 | ✅ | ✅ | 10 images | ✅ Balanced |
| dall-e-3 | ❌→✅ | ✅ | 1 image | High-quality generation |
| gpt-image-1 | ✅ | ✅ | 10 images | ✅ Fast |
| gpt-image-1-mini | ✅ | ✅ | 10 images | ✅ Fastest |

### Features
- ✅ Mask support (inpainting)
- ✅ Automatic model downgrade (dall-e-3→dall-e-2)
- ✅ Dual implementation (editing uses AI SDK, generation uses native API)

---

## 4. xAI (Grok/Aurora)

### Configuration
```env
XAI_API_KEY=your-api-key
XAI_IMAGE_MODEL=grok-2-image
```

### Features
- ✅ Text-to-image generation
- ✅ Up to 10 images per request
- ⚠️ **Fixed size 1024x768** (no custom size/aspectRatio support)
- ❌ **No image editing support** (API limitation, only Web interface supports it)
- ❌ No mask support
- ❌ No explicit edit modes

### Important Limitations
According to AI SDK official documentation and source code:
1. **No `size` parameter support** - Passing it causes `IMAGE_PROCESS_FAILED` error
2. **No `aspectRatio` parameter support** - Passing it causes `IMAGE_PROCESS_FAILED` error
3. **Default size: 1024x768** - Cannot be changed
4. **Text-to-image generation only** - No image editing support

### Usage Examples
```
# Generate image (supported)
/img a cute dog in the garden

# Image editing (not supported)
[Reply to image] /img make this in Van Gogh style  # ❌ Will error
```

### Important Note
xAI API currently **only supports text-to-image generation**, not image editing. Image editing feature is only available in Grok Web interface.

For image editing, please use:
- **Google** - Quick editing
- **Vertex** - Professional editing
- **OpenAI** - Balanced choice

---

## Complete Feature Comparison

### Basic Features
| Feature | Google | Vertex | OpenAI | xAI |
|---------|--------|--------|--------|-----|
| Text Generation | ✅ | ✅ | ✅ | ✅ |
| Image Editing | ✅ | ✅ | ✅ | ❌ |
| Mask Support | ❌ | ✅ | ✅ | ❌ |
| Multi-image Input | ✅(14) | ✅ | ❌(1) | ❌(1) |

### Editing Control
| Feature | Google | Vertex | OpenAI | xAI |
|---------|--------|--------|--------|-----|
| Explicit Edit Modes | ❌ | ✅(6 modes) | ❌ | ❌ |
| Negative Prompt | ❌ | ✅ | ❌ | ❌ |
| Quality Control | ❌ | ✅ | ✅ | ❌ |
| Mask Modes | ❌ | ✅(5 modes) | ✅ | ❌ |

### Performance
| Metric | Google | Vertex | OpenAI | xAI |
|--------|--------|--------|--------|-----|
| Speed | Fast | Medium | Fast | Fast |
| Quality | Good | Very Good | Good-Very Good | Good |
| Cost | Low | Medium | Medium | Medium |
| Max Per Request | 4 images | 4 images | 10 images | 10 images |

---

## LLM Tool Usage

### Generate Image
```json
{
  "agent": "vertex",
  "prompts": ["a cute dog in a garden"]
}
```

### Edit Image (Basic)
```json
{
  "agent": "google",
  "prompts": ["make it more colorful"],
  "referenceImages": ["base64_image"]
}
```

### Edit Image (Advanced - Vertex)
```json
{
  "agent": "vertex",
  "prompts": ["remove the red car from the image"],
  "referenceImages": ["base64_image"],
  "editMode": "EDIT_MODE_INPAINT_REMOVAL",
  "mask": "base64_mask",
  "maskMode": "MASK_MODE_USER_PROVIDED",
  "maskDilation": 0.01,
  "negativePrompt": "blurry, unnatural",
  "baseSteps": 60
}
```

### Style Transfer (xAI - Generation Only)
```json
{
  "agent": "xai",
  "prompts": ["A beautiful sunset over the ocean with vibrant colors"]
  // ❌ Does not support referenceImages (image editing)
}
```

---

## Practical Tips

### Choosing the Right Agent

**Google - Daily Quick Editing**
- ✅ Fast iteration
- ✅ Conversational editing
- ✅ Multi-image composition
- ❌ No precise control

**Vertex - Professional Editing**
- ✅ Need precise control
- ✅ Product images
- ✅ Complex editing tasks
- ✅ Background replacement/extension

**OpenAI - Balanced Choice**
- ✅ DALL-E 3 high-quality generation
- ✅ Mask editing support
- ✅ Fast response
- ⚠️ Medium editing capabilities

**xAI - Generation Only**
- ✅ High-quality image generation
- ✅ Multiple image generation (up to 10)
- ❌ No image editing support
- ⚠️ API limitations (editing only on Web interface)

### Prompt Best Practices

**Good prompts:**
```
✅ "Add a bouquet of vibrant roses in the center of the table, maintain original lighting and perspective"
✅ "Replace the background with a modern office environment, professional lighting, keep the person unchanged"
✅ "Remove the red car on the right side of the image, naturally fill the background"
```

**Bad prompts:**
```
❌ "Change it"
❌ "Make it better"
❌ "Change background"
```

### Configuration Recommendations

**Daily Use (Recommended):**
```env
AI_IMAGE_PROVIDER=google
GOOGLE_IMAGE_MODEL=gemini-2.5-flash-image
```

**Professional Editing (Recommended):**
```env
AI_IMAGE_PROVIDER=vertex
VERTEX_IMAGE_MODEL=imagen-3.0-capability-001
```

**High-Quality Generation + Editing:**
```env
AI_IMAGE_PROVIDER=openai
DALL_E_MODEL=dall-e-2  # or gpt-image-1
```

**Experimental/Style Transfer:**
```env
AI_IMAGE_PROVIDER=xai
XAI_IMAGE_MODEL=grok-2-image
```

---

## Troubleshooting

### Vertex "Mask image is missing" Error
**Issue:** "Image editing failed with the following error: Mask image is missing."
**Cause:** Some edit modes (like EDIT_MODE_INPAINT_INSERTION) require mask, but Telegram command didn't provide one
**Solution:** Code automatically handles this, uses EDIT_MODE_CONTROLLED_EDITING when no mask

### Vertex Editing Failure
**Issue:** "Model does not support editing"
**Cause:** Used imagen-4.0 (doesn't support editing)
**Solution:** Code automatically handles this, forces imagen-3.0-capability-001

### OpenAI Editing Failure
**Issue:** dall-e-3 editing error
**Cause:** dall-e-3 doesn't support editing
**Solution:** Code automatically downgrades to dall-e-2

### Google Mask Not Working
**Issue:** mask parameter has no effect
**Cause:** Google Generative AI doesn't support masks
**Solution:** Use Vertex AI or describe the area through detailed prompts

### xAI Editing Error
**Issue:** "Bad Request: IMAGE_PROCESS_FAILED"
**Cause 1:** xAI API doesn't support image editing (only Web interface supports it)
**Cause 2:** Passed unsupported parameters (`size`, `aspectRatio`)
**Solution:**
- Use xAI for image generation only, use Google/Vertex/OpenAI for editing
- Don't pass `size` or `aspectRatio` parameters
- xAI generates 1024x768 images by default

---

## Technical Implementation Details

### Vertex Smart Mode Selection
```typescript
// src/agent/vertex.ts
const isEditMode = (referenceImages && referenceImages.length > 0) || mask;
const modelId = isEditMode
    ? 'imagen-3.0-capability-001'  // Editing: forced
    : this.model(context);          // Generation: configured

// Smart edit mode selection
const defaultEditMode = mask
    ? 'EDIT_MODE_INPAINT_INSERTION'      // With mask: precise inpainting
    : 'EDIT_MODE_CONTROLLED_EDITING';    // Without mask: general editing
```

### OpenAI Auto-Downgrade
```typescript
// src/agent/openai.ts
const isEditMode = (referenceImages && referenceImages.length > 0) || mask;
const actualModel = isEditMode
    ? (modelId === 'dall-e-3' ? 'dall-e-2' : modelId)
    : modelId;
```

### Telegram Command Support
```typescript
// src/telegram/command/system.ts
// Only Google, Vertex, OpenAI support image editing
if (['google', 'vertex', 'openai'].includes(agent.name)) {
    extraParams.referenceImages = await getTelegramFile(...);
}
// xAI doesn't support editing, will throw error in agent
```

### xAI Using AI SDK
```typescript
// src/agent/xai.ts
import { xai } from '@ai-sdk/xai';
import { generateImage } from 'ai';

// Important: Don't pass size, aspectRatio parameters
const { images } = await generateImage({
    model: xai({
        apiKey: context.XAI_API_KEY,
        baseURL: context.XAI_API_BASE,
    }).image('grok-2-image'),
    prompt,
    n,
    // Don't pass size, aspectRatio - xAI doesn't support them
});
// Default output: 1024x768
```

---

## Changelog

### 2025-12-20
- ✅ Upgraded to new AI SDK `generateImage` API
- ✅ Vertex added smart model selection (auto-switch between editing/generation)
- ✅ Vertex added smart edit mode selection (with/without mask)
- ✅ Vertex supports 6 edit modes and advanced parameters
- ✅ OpenAI added image editing support (auto-downgrade)
- ✅ xAI added image generation support (**no editing support**)
- ✅ Updated dependencies to latest beta versions
- ✅ Preserved Google's original editing functionality
- ✅ Fixed Vertex "Mask image is missing" error
- ✅ Fixed xAI "IMAGE_PROCESS_FAILED" error (removed unsupported parameters)
- ✅ xAI now uses AI SDK (correctly handles parameter limitations)

---

## Reference Resources

- [Google Gemini Image API](https://ai.google.dev/gemini-api/docs/image-generation)
- [Vertex AI Image Editing](https://cloud.google.com/vertex-ai/generative-ai/docs/image/edit-images)
- [Vertex AI Model Versions](https://cloud.google.com/vertex-ai/generative-ai/docs/image/model-versioning)
- [OpenAI Image Generation](https://platform.openai.com/docs/guides/images)
- [xAI API Documentation](https://docs.x.ai/docs/overview)
- [AI SDK Documentation](https://sdk.vercel.ai/docs/ai-sdk-core/generating-images)

---

**Maintainer:** Claude Code
**Last Updated:** 2025-12-20
