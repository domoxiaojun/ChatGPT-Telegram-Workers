# 图片编辑功能完整指南

**更新时间：** 2025-12-20

---

## 快速开始

### 支持的 Agents

| Agent | 生成 | 编辑 | 遮罩 | 编辑模式 | 推荐场景 |
|-------|------|------|------|----------|---------|
| **Google** | ✅ | ✅ | ❌ | 隐式 | 快速编辑、对话迭代 |
| **Vertex** | ✅ | ✅ | ✅ | 6种显式 | 专业编辑、精确控制 |
| **OpenAI** | ✅ | ✅ | ✅ | 隐式 | 平衡性能、DALL-E 3生成 |
| **xAI** | ✅ | ✅ | ❌ | 隐式 | 风格转换、最多10张 |

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
```

### 特点
- ✅ 简单快速
- ✅ 对话式迭代编辑
- ✅ 多图合成（最多14张）
- ❌ 不支持遮罩

### 使用示例
```
[回复图片] /img 让颜色更鲜艳
[回复图片] /img 将背景换成海滩
```

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

#### 1. EDIT_MODE_INPAINT_INSERTION（默认）
插入新对象或内容
```json
{
  "agent": "vertex",
  "prompts": ["在桌子上添加一个红色的苹果"],
  "referenceImages": ["base64..."],
  "editMode": "EDIT_MODE_INPAINT_INSERTION",
  "mask": "base64_mask"
}
```

#### 2. EDIT_MODE_INPAINT_REMOVAL
移除对象
```json
{
  "editMode": "EDIT_MODE_INPAINT_REMOVAL",
  "prompts": ["移除图片中的所有人"]
}
```

#### 3. EDIT_MODE_OUTPAINT
扩展图片边界
```json
{
  "editMode": "EDIT_MODE_OUTPAINT",
  "prompts": ["向右扩展，添加更多森林"]
}
```

#### 4. EDIT_MODE_CONTROLLED_EDITING
精确控制的编辑
```json
{
  "editMode": "EDIT_MODE_CONTROLLED_EDITING",
  "prompts": ["只改变花瓶的颜色为蓝色"],
  "baseSteps": 60
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

## 4. xAI (Grok/Aurora)

### 配置
```env
XAI_API_KEY=your-api-key
XAI_IMAGE_MODEL=grok-2-image
```

### 特点
- ✅ Multimodal 输入（文本+图片）
- ✅ 风格转换强大
- ✅ 最多10张图片/次
- ❌ 无遮罩支持
- ❌ 无显式编辑模式

### 使用示例
```
[回复图片] /img make this in Van Gogh style
[回复图片] /img change color scheme to pastel
```

---

## 完整功能对比

### 基础功能
| 功能 | Google | Vertex | OpenAI | xAI |
|------|--------|--------|--------|-----|
| 文本生成 | ✅ | ✅ | ✅ | ✅ |
| 图片编辑 | ✅ | ✅ | ✅ | ✅ |
| 遮罩支持 | ❌ | ✅ | ✅ | ❌ |
| 多图输入 | ✅(14) | ✅ | ❌(1) | ❌(1) |

### 编辑控制
| 功能 | Google | Vertex | OpenAI | xAI |
|------|--------|--------|--------|-----|
| 显式编辑模式 | ❌ | ✅(6种) | ❌ | ❌ |
| 负面提示 | ❌ | ✅ | ❌ | ❌ |
| 质量控制 | ❌ | ✅ | ✅ | ❌ |
| 遮罩模式 | ❌ | ✅(5种) | ✅ | ❌ |

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

### 风格转换（xAI）
```json
{
  "agent": "xai",
  "prompts": ["Transform to Van Gogh painting style"],
  "referenceImages": ["base64_image"]
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

**xAI - 风格转换**
- ✅ 艺术风格转换
- ✅ 自然语言理解好
- ✅ 多张图片生成
- ⚠️ 编辑精度较低

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
XAI_IMAGE_MODEL=grok-2-image
```

---

## 故障排除

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

### xAI 编辑效果不理想
**问题：** 编辑不精确
**原因：** xAI 无显式编辑模式，依赖模型理解
**解决：** 使用更详细的提示词，或切换到 Vertex

---

## 技术实现细节

### Vertex 智能模型选择
```typescript
// src/agent/vertex.ts
const isEditMode = (referenceImages && referenceImages.length > 0) || mask;
const modelId = isEditMode
    ? 'imagen-3.0-capability-001'  // 编辑：强制
    : this.model(context);          // 生成：配置
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
if (['google', 'vertex', 'openai', 'xai'].includes(agent.name)) {
    extraParams.referenceImages = await getTelegramFile(...);
}
```

---

## 更新日志

### 2025-12-20
- ✅ 升级到新的 AI SDK `generateImage` API
- ✅ Vertex 添加智能模型选择
- ✅ Vertex 支持 6 种编辑模式和高级参数
- ✅ OpenAI 添加图片编辑支持（自动降级）
- ✅ xAI 添加图片生成和编辑支持
- ✅ 更新依赖到最新 beta 版本
- ✅ 保留 Google 原有编辑功能

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
**最后更新：** 2025-12-20
