# 图片编辑功能完整指南

**更新时间：** 2025-12-20

---

## 快速开始

### 支持的 Agents

| Agent | 生成 | 编辑 | 遮罩 | 编辑模式 | 新功能 | 推荐场景 |
|-------|------|------|------|----------|--------|------------|
| **Google** | ✅ | ✅ | ❌ | 隐式 | 4K分辨率、Google Search | 快速编辑、实时数据可视化 |
| **Vertex** | ✅ | ✅ | ✅ | 6种显式 | - | 专业编辑、精确控制 |
| **OpenAI** | ✅ | ✅ | ✅ | 隐式 | - | 平衡性能、DALL-E 3生成 |
| **xAI** | ✅ | ✅ | ❌ | 隐式 | 视频生成、图生视频、视频编辑 | 图片编辑、视频创作 |

### Telegram 使用

```
# 生成图片
/img 一只可爱的小狗在花园里

# 编辑图片（回复图片）
[回复图片] /img 让它更丰富多彩
```

---

## 1. Google Generative AI

### 配置
```env
GOOGLE_API_KEY=your-api-key
GOOGLE_IMAGE_MODEL=gemini-2.5-flash-image

# Gemini 3 Pro Image 新功能（gemini-3-pro-image-preview）
GOOGLE_IMAGE_MODEL=gemini-3-pro-image-preview

# 可选：宽高比设置（"1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"）
GOOGLE_IMAGE_ASPECT_RATIO=16:9

# 可选：分辨率设置（"1K", "2K", "4K"）
GOOGLE_IMAGE_SIZE=4K

# 可选：启用 Google Search grounding（实时数据：天气、股票、新闻）
GOOGLE_IMAGE_ENABLE_GOOGLE_SEARCH=true
```

### 特点
- ✅ 简单快速
- ✅ 对话式迭代编辑
- ✅ 多图合成（最多14张）
- ❌ 不支持遮罩

### Gemini 3 Pro Image 新功能 ⭐
**模型：** `gemini-3-pro-image-preview`

#### 高分辨率输出
- 支持 **1K、2K、4K** 三种分辨率
- 专业资产生产优化
- Token 消耗：1K ≈ 1120 tokens，4K ≈ 2000 tokens

#### 灵活宽高比
支持 10 种宽高比：
- 方形：`1:1`
- 竖屏：`2:3`, `3:4`, `4:5`, `9:16`
- 横屏：`3:2`, `4:3`, `5:4`, `16:9`, `21:9`

#### Google Search Grounding（实时数据）
启用后可生成基于实时信息的图片：
- 📰 当前新闻事件
- 🌤️ 实时天气地图
- 📈 最新股票图表
- 🗺️ 地理数据可视化

```env
GOOGLE_IMAGE_ENABLE_GOOGLE_SEARCH=true
```

示例提示词：
```
/img 生成今天台北的天气预报信息图
/img 创建一个展示过去一周特斯拉股价的图表
/img 制作一张关于2025年AI发展的信息图
```

#### 高级文本渲染
- 生成清晰、风格化的文本
- 适用于：信息图、菜单、图表、营销素材

#### Thinking Mode（推理模式）
- 模型会进行"思考"过程
- 生成中间"思考图像"（后端可见，不计费）
- 优化最终高质量输出

#### 更多参考图像
- 支持最多 **14 张参考图像**
- 可混合：最多 6 个物体 + 5 个人物图像

### 使用示例
```
# 基础编辑
[回复图片] /img 让颜色更鲜艳
[回复图片] /img 将背景换成海滩

# Gemini 3 Pro Image - 高分辨率 + 宽高比
# 配置：GOOGLE_IMAGE_SIZE=4K, GOOGLE_IMAGE_ASPECT_RATIO=16:9
/img 一个未来科技城市的全景图

# Google Search - 实时数据
# 配置：GOOGLE_IMAGE_ENABLE_GOOGLE_SEARCH=true
/img 制作一张展示今天全球主要股市表现的信息图
/img 生成一个包含最新AI技术趋势的可视化图表
```

### 模型对比

| 功能 | gemini-2.5-flash-image | gemini-3-pro-image-preview |
|------|----------------------|---------------------------|
| 生成/编辑 | ✅ | ✅ |
| 分辨率 | 默认 | 1K/2K/4K 可选 |
| 宽高比 | 有限 | 10 种选择 |
| Google Search | ❌ | ✅ |
| 高级文本 | 基础 | 专业级 |
| Thinking Mode | ❌ | ✅ |
| 参考图像 | 14张 | 14张（6物体+5人物）|
| 推荐场景 | 快速迭代 | 专业资产制作 |

---

## 2. Vertex AI（功能最强大）

### 配置
```env
VERTEX_PROJECT_ID=your-project-id
VERTEX_IMAGE_MODEL=imagen-3.0-capability-001  # 编辑专用
VERTEX_CREDENTIALS={"client_email":"...","private_key":"..."}
```

### 智能模型选择

代码会**自动选择**正确的模型：
- 有引用图片 → 强制使用 `imagen-3.0-capability-001`（唯一支持编辑）
- 纯生成 → 使用配置的模型（可以是 `imagen-4.0-fast-generate-001`）

### 模型对比

| 模型 | 编辑 | 生成 | 推荐用途 |
|------|------|------|---------|
| **imagen-3.0-capability-001** | ✅ | ✅ | **必须用于编辑** |
| imagen-4.0-fast-generate-001 | ❌ | ✅ | 快速生成（不支持编辑） |

### 6种编辑模式

#### 智能默认模式选择
- **有 mask 图片时**：默认使用 `EDIT_MODE_INPAINT_INSERTION`（精确 inpainting）
- **无 mask 图片时**：默认使用 `EDIT_MODE_CONTROLLED_EDITING`（通用受控编辑）

#### 1. EDIT_MODE_CONTROLLED_EDITING（Telegram 默认）
通用受控编辑，不需要 mask
```json
{
  "agent": "vertex",
  "prompts": ["将背景改成蓝色"],
  "referenceImages": ["base64..."],
  "editMode": "EDIT_MODE_CONTROLLED_EDITING"
}
```

#### 2. EDIT_MODE_INPAINT_INSERTION（有 mask 时默认）
插入新对象或内容（需要 mask）
```json
{
  "agent": "vertex",
  "prompts": ["在桌子上添加一个红色的苹果"],
  "referenceImages": ["base64..."],
  "editMode": "EDIT_MODE_INPAINT_INSERTION",
  "mask": "base64_mask"
}
```

#### 3. EDIT_MODE_INPAINT_REMOVAL
移除对象
```json
{
  "editMode": "EDIT_MODE_INPAINT_REMOVAL",
  "prompts": ["移除图片中的所有人"]
}
```

#### 4. EDIT_MODE_OUTPAINT
扩展图片边界
```json
{
  "editMode": "EDIT_MODE_OUTPAINT",
  "prompts": ["向右扩展，添加更多森林"]
}
```

#### 5. EDIT_MODE_PRODUCT_IMAGE
产品图片优化
```json
{
  "editMode": "EDIT_MODE_PRODUCT_IMAGE",
  "prompts": ["将产品放在白色背景上"]
}
```

#### 6. EDIT_MODE_BGSWAP
背景替换
```json
{
  "editMode": "EDIT_MODE_BGSWAP",
  "prompts": ["将背景换成海滩日落"]
}
```

### 高级参数

#### maskMode（遮罩模式）
- `MASK_MODE_USER_PROVIDED` - 手动提供遮罩
- `MASK_MODE_DETECTION_BOX` - 自动检测边界
- `MASK_MODE_CLOTHING_AREA` - 服装区域分割
- `MASK_MODE_PARSED_PERSON` - 人体解析

#### maskDilation（遮罩扩张）
```json
{
  "maskDilation": 0.01  // 0-1，推荐 0.01
}
```

#### negativePrompt（负面提示）
```json
{
  "negativePrompt": "模糊、低质量、变形、多余的腿"
}
```

#### baseSteps（生成步数）
```json
{
  "baseSteps": 60  // 35-75，越高质量越好
}
```

### 遮罩制作

遮罩是黑白图片：
- **白色（255,255,255）** = 要编辑的区域
- **黑色（0,0,0）** = 保持不变

---

## 3. OpenAI/DALL-E

### 配置
```env
OPENAI_API_KEY=your-api-key
DALL_E_MODEL=dall-e-2  # 或 dall-e-3, gpt-image-1
```

### 智能模型选择

代码会**自动调整**：
- dall-e-3 编辑时 → 自动降级到 dall-e-2
- 其他模型 → 按配置使用

### 支持的模型

| 模型 | 编辑 | 生成 | 每次最多 | 推荐 |
|------|------|------|----------|------|
| dall-e-2 | ✅ | ✅ | 10张 | ✅ 平衡 |
| dall-e-3 | ❌→✅ | ✅ | 1张 | 高质量生成 |
| gpt-image-1 | ✅ | ✅ | 10张 | ✅ 快速 |
| gpt-image-1-mini | ✅ | ✅ | 10张 | ✅ 最快 |

### 特点
- ✅ 支持遮罩（inpainting）
- ✅ 自动模型降级（dall-e-3→dall-e-2）
- ✅ 双实现（编辑用AI SDK，生成用原API）

---

## 4. xAI (Grok Imagine)

### 配置
```env
XAI_API_KEY=your-api-key
XAI_IMAGE_MODEL=grok-imagine-image  # 新版图片生成和编辑模型
```

### 特点
- ✅ 文本生成图片
- ✅ **图片编辑（Image-to-Image）** - 现已支持！
- ✅ 支持宽高比（aspectRatio）
- ✅ **视频生成（通过 xai_video 工具）**
- ✅ **图生视频（Image-to-Video）**
- ✅ **视频编辑（Video-to-Video）**
- ❌ 无遮罩支持
- ❌ 无显式编辑模式

### 图片功能

#### 模型
- `grok-2-image` - 旧版图片生成模型
- `grok-imagine-image` - **新版图片生成和编辑模型（推荐）**

#### 文本生成图片
```
/img a cute dog in the garden
```

#### 图片编辑（现已支持！）
```
# 回复图片进行编辑
[回复图片] /img 把猫变成金毛犬
[回复图片] /img 将背景改成海滩日落
[回复图片] /img 让图片更加色彩鲜艳
```

#### 支持的参数
- `aspectRatio`: 宽高比（如 "16:9", "9:16", "1:1"）
- `n`: 生成数量（1-10张）

### 视频功能 ⭐

xAI 提供强大的视频生成能力，通过 `xai_video` 工具调用。

#### 模型
- `grok-imagine-video` - 视频生成、图生视频、视频编辑模型

#### 1. 文本生成视频（Text-to-Video）
```json
{
  "name": "xai_video",
  "arguments": {
    "prompt": "一只约克夏在旧金山Crissy Field的蒲公英丛中",
    "mode": "text-to-video",
    "aspectRatio": "16:9",
    "duration": 5,
    "resolution": "720p"
  }
}
```

#### 2. 图生视频（Image-to-Video）
```json
{
  "name": "xai_video",
  "arguments": {
    "prompt": "猫慢慢转头并眨眼",
    "mode": "image-to-video",
    "imageUrl": "https://example.com/cat.png",
    "duration": 5,
    "aspectRatio": "16:9"
  }
}
```

#### 3. 视频编辑（Video-to-Video）
```json
{
  "name": "xai_video",
  "arguments": {
    "prompt": "将这只猫渲染成90年代动漫风格的狗",
    "mode": "video-edit",
    "videoUrl": "https://example.com/video.mp4"
  }
}
```

#### 视频参数说明
- `mode`: 模式
  - `text-to-video` - 文本生成视频
  - `image-to-video` - 图片生成视频
  - `video-edit` - 视频编辑
- `aspectRatio`: 宽高比（仅生成模式）
  - `16:9`, `9:16`, `1:1`
- `duration`: 时长（仅生成模式）
  - 固定 5 秒
- `resolution`: 分辨率（仅生成模式）
  - `480p`, `720p`
- `imageUrl`: 图片URL（图生视频模式必需）
- `videoUrl`: 视频URL（视频编辑模式必需）

#### 重要说明
- 视频生成是**异步操作**，需要等待约 1-5 分钟
- 视频编辑模式**不支持** `duration` 和 `aspectRatio` 参数
- 轮询超时时间：10 分钟
- 轮询间隔：5 秒

### 使用示例

#### 图片生成
```
/img a beautiful sunset over the ocean
```

#### 图片编辑
```
[回复图片] /img 把这只猫变成金毛犬
[回复图片] /img 将背景换成未来科技城市
```

#### 视频生成（通过 LLM 工具调用）
```
生成一个5秒的视频：一只约克夏在蒲公英丛中玩耍
```

LLM 会自动调用 `xai_video` 工具：
```json
{
  "name": "xai_video",
  "arguments": {
    "prompt": "一只约克夏在蒲公英丛中玩耍",
    "mode": "text-to-video",
    "duration": 5
  }
}
```

### 技术实现

#### 图片编辑
```typescript
// src/agent/xai.ts
import { createXai } from '@ai-sdk/xai';
import { generateImage } from 'ai';

// 图片编辑
const { images } = await generateImage({
    model: xaiClient.image('grok-imagine-image'),
    prompt: {
        text: '把猫变成金毛犬',
        images: [imageBuffer], // 参考图片
    },
    n: 1,
    aspectRatio: '16:9',
});
```

#### 视频生成
```typescript
// src/tools/internal/xai_video.ts
import { experimental_generateVideo as generateVideo } from 'ai';

// 文本生成视频
const { videos } = await generateVideo({
    model: xaiClient.video('grok-imagine-video'),
    prompt: '一只约克夏在蒲公英丛中',
    duration: 5,
    aspectRatio: '16:9',
    providerOptions: {
        xai: {
            resolution: '720p',
            pollTimeoutMs: 600000, // 10分钟
            pollIntervalMs: 5000,
        },
    },
});
```

### 限制说明
- 图片编辑：不支持遮罩（mask）
- 视频生成：固定 5 秒时长
- 视频编辑：不支持自定义时长和宽高比
- 每次只能生成 1 个视频

---

## 完整功能对比

### 基础功能
| 功能 | Google | Vertex | OpenAI | xAI |
|------|--------|--------|--------|-----|
| 文本生成 | ✅ | ✅ | ✅ | ✅ |
| 图片编辑 | ✅ | ✅ | ✅ | ✅ |
| 遮罩支持 | ❌ | ✅ | ✅ | ❌ |
| 多图输入 | ✅(14) | ✅ | ❌(1) | ✅(1) |
| 视频生成 | ❌ | ❌ | ❌ | ✅ |

### 编辑控制
| 功能 | Google | Vertex | OpenAI | xAI |
|------|--------|--------|--------|-----|
| 显式编辑模式 | ❌ | ✅(6种) | ❌ | ❌ |
| 负面提示 | ❌ | ✅ | ❌ | ❌ |
| 质量控制 | ❌ | ✅ | ✅ | ❌ |
| 遮罩模式 | ❌ | ✅(5种) | ✅ | ❌ |
| 视频编辑 | ❌ | ❌ | ❌ | ✅ |

### 性能
| 指标 | Google | Vertex | OpenAI | xAI |
|------|--------|--------|--------|-----|
| 速度 | 快 | 中 | 快 | 快 |
| 质量 | 好 | 很好 | 好-很好 | 好 |
| 成本 | 低 | 中 | 中 | 中 |
| 每次最多 | 4张 | 4张 | 10张 | 10张 |

---

## LLM Tool 使用

### 生成图片
```json
{
  "agent": "vertex",
  "prompts": ["一只可爱的小狗在花园里"]
}
```

### 编辑图片（基础）
```json
{
  "agent": "google",
  "prompts": ["让它更丰富多彩"],
  "referenceImages": ["base64_image"]
}
```

### 编辑图片（高级 - Vertex）
```json
{
  "agent": "vertex",
  "prompts": ["移除图片中的红色汽车"],
  "referenceImages": ["base64_image"],
  "editMode": "EDIT_MODE_INPAINT_REMOVAL",
  "mask": "base64_mask",
  "maskMode": "MASK_MODE_USER_PROVIDED",
  "maskDilation": 0.01,
  "negativePrompt": "模糊、不自然",
  "baseSteps": 60
}
```

### 风格转换（xAI - 仅生成）
```json
{
  "agent": "xai",
  "prompts": ["A beautiful sunset over the ocean with vibrant colors"]
  // ❌ 不支持 referenceImages（图片编辑）
}
```

---

## 实用技巧

### 选择合适的 Agent

**Google - 日常快速编辑**
- ✅ 快速迭代
- ✅ 对话式编辑
- ✅ 多图合成
- ❌ 无精确控制

**Vertex - 专业编辑**
- ✅ 需要精确控制
- ✅ 产品图片
- ✅ 复杂编辑任务
- ✅ 背景替换/扩展

**OpenAI - 平衡选择**
- ✅ DALL-E 3 高质量生成
- ✅ 支持遮罩编辑
- ✅ 快速响应
- ⚠️ 编辑功能中等

**xAI - 图片编辑和视频创作**
- ✅ 图片生成和编辑
- ✅ 文本生成视频
- ✅ 图片生成视频
- ✅ 视频编辑转换
- ❌ 不支持遮罩编辑

### 提示词最佳实践

**好的提示词：**
```
✅ "在桌子中央添加一束鲜艳的玫瑰花，保持原有光线和视角"
✅ "将背景替换为现代办公室环境，专业打光，保持人物不变"
✅ "移除图片右侧的红色汽车，自然填充背景"
```

**差的提示词：**
```
❌ "改一下"
❌ "好看点"
❌ "换背景"
```

### 配置建议

**日常使用（推荐）：**
```env
AI_IMAGE_PROVIDER=google
GOOGLE_IMAGE_MODEL=gemini-2.5-flash-image
```

**专业编辑（推荐）：**
```env
AI_IMAGE_PROVIDER=vertex
VERTEX_IMAGE_MODEL=imagen-3.0-capability-001
```

**高质量生成+编辑：**
```env
AI_IMAGE_PROVIDER=openai
DALL_E_MODEL=dall-e-2  # 或 gpt-image-1
```

**实验性/风格转换：**
```env
AI_IMAGE_PROVIDER=xai
XAI_IMAGE_MODEL=grok-imagine-image
```

**视频生成（xAI）：**
通过 LLM 工具调用 `xai_video`，支持文本生成视频、图生视频、视频编辑。

---

## 故障排除

### Vertex "Mask image is missing" 错误
**问题：** "Image editing failed with the following error: Mask image is missing."
**原因：** 某些编辑模式（如 EDIT_MODE_INPAINT_INSERTION）需要 mask，但 Telegram 命令没有提供
**解决：** 代码已自动处理，无 mask 时使用 EDIT_MODE_CONTROLLED_EDITING

### Vertex 编辑失败
**问题：** "Model does not support editing"
**原因：** 使用了 imagen-4.0（不支持编辑）
**解决：** 代码已自动处理，强制使用 imagen-3.0-capability-001

### OpenAI 编辑失败
**问题：** dall-e-3 编辑报错
**原因：** dall-e-3 不支持编辑
**解决：** 代码已自动降级到 dall-e-2

### Google 遮罩不工作
**问题：** mask 参数无效
**原因：** Google Generative AI 不支持遮罩
**解决：** 使用 Vertex AI 或通过详细提示词描述区域

### xAI 编辑报错
**问题：** "xAI API does not support image editing yet"
**原因：** 使用了旧版 `grok-2-image` 模型
**解决：** 更新配置使用 `grok-imagine-image` 模型

```env
XAI_IMAGE_MODEL=grok-imagine-image
```

---

## 技术实现细节

### Vertex 智能模式选择
```typescript
// src/agent/vertex.ts
const isEditMode = (referenceImages && referenceImages.length > 0) || mask;
const modelId = isEditMode
    ? 'imagen-3.0-capability-001'  // 编辑：强制
    : this.model(context);          // 生成：配置

// 智能选择编辑模式
const defaultEditMode = mask
    ? 'EDIT_MODE_INPAINT_INSERTION'      // 有 mask：精确 inpainting
    : 'EDIT_MODE_CONTROLLED_EDITING';    // 无 mask：通用编辑
```

### OpenAI 自动降级
```typescript
// src/agent/openai.ts
const isEditMode = (referenceImages && referenceImages.length > 0) || mask;
const actualModel = isEditMode
    ? (modelId === 'dall-e-3' ? 'dall-e-2' : modelId)
    : modelId;
```

### Telegram 命令支持
```typescript
// src/telegram/command/system.ts
// 仅 Google、Vertex、OpenAI 支持图片编辑
if (['google', 'vertex', 'openai'].includes(agent.name)) {
    extraParams.referenceImages = await getTelegramFile(...);
}
// xAI 不支持编辑，会在 agent 中抛出错误
```

### xAI 使用 AI SDK
```typescript
// src/agent/xai.ts
import { createXai } from '@ai-sdk/xai';
import { generateImage, experimental_generateVideo as generateVideo } from 'ai';

// 图片生成
const { images } = await generateImage({
    model: xaiClient.image('grok-imagine-image'),
    prompt,
    n,
    aspectRatio,
});

// 图片编辑
const { images } = await generateImage({
    model: xaiClient.image('grok-imagine-image'),
    prompt: {
        text: '把猫变成金毛犬',
        images: [imageBuffer],
    },
});

// 视频生成
const { videos } = await generateVideo({
    model: xaiClient.video('grok-imagine-video'),
    prompt: '一只约克夏在蒲公英丛中',
    duration: 5,
    aspectRatio: '16:9',
    providerOptions: {
        xai: {
            resolution: '720p',
            pollTimeoutMs: 600000,
        },
    },
});
```

---

## 更新日志

### 2025-02-15
- ✅ **xAI 添加图片编辑支持**（grok-imagine-image）
- ✅ **xAI 添加视频生成功能**（grok-imagine-video）
- ✅ 支持文本生成视频（Text-to-Video）
- ✅ 支持图片生成视频（Image-to-Video）
- ✅ 支持视频编辑（Video-to-Video）
- ✅ 新增 `xai_video` 工具
- ✅ 更新默认模型为 `grok-imagine-image`
- ✅ 支持 aspectRatio 参数

### 2025-12-20
- ✅ 升级到新的 AI SDK `generateImage` API
- ✅ Vertex 添加智能模型选择（编辑/生成自动切换）
- ✅ Vertex 添加智能编辑模式选择（有/无 mask）
- ✅ Vertex 支持 6 种编辑模式和高级参数
- ✅ OpenAI 添加图片编辑支持（自动降级）
- ✅ xAI 添加图片生成支持（**不支持编辑**）
- ✅ 更新依赖到最新 beta 版本
- ✅ 保留 Google 原有编辑功能
- ✅ 修复 Vertex "Mask image is missing" 错误
- ✅ 修复 xAI "IMAGE_PROCESS_FAILED" 错误（移除不支持的参数）
- ✅ xAI 改用 AI SDK（正确处理参数限制）

---

## 参考资源

- [Google Gemini Image API](https://ai.google.dev/gemini-api/docs/image-generation)
- [Vertex AI Image Editing](https://cloud.google.com/vertex-ai/generative-ai/docs/image/edit-images)
- [Vertex AI Model Versions](https://cloud.google.com/vertex-ai/generative-ai/docs/image/model-versioning)
- [OpenAI Image Generation](https://platform.openai.com/docs/guides/images)
- [xAI API Documentation](https://docs.x.ai/docs/overview)
- [AI SDK Documentation](https://sdk.vercel.ai/docs/ai-sdk-core/generating-images)

---

**维护者：** Claude Code
**最后更新：** 2025-02-15
