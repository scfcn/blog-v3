## 问题分析
PostOrderToggle 组件（实际为 OrderToggle.vue）存在水合问题，导致服务器端渲染的 HTML 与客户端渲染的 HTML 不一致。

### 可能的原因
1. **第三方组件动态内容生成**：ZDropdown 组件内部使用的 Tooltip 组件可能在客户端动态生成 DOM
2. **条件渲染不一致**：组件中的 v-if 条件在服务器端和客户端评估结果可能不同
3. **状态初始化问题**：某些状态可能没有明确的默认值
4. **第三方脚本依赖**：组件可能依赖于客户端加载的脚本

## 修复方案

### 1. 隔离第三方组件
使用 Nuxt 的 `<ClientOnly>` 组件包装 ZDropdown 组件，确保它只在客户端渲染：
```vue
<ClientOnly>
  <ZDropdown trigger="focusin" tabindex="0">
    <!-- 内容 -->
  </ZDropdown>
</ClientOnly>
```

### 2. 修复状态初始化
确保所有状态都有明确的默认值，特别是 defineModel 的初始值：
```typescript
const category = defineModel<string>('category', { default: undefined })
const sortOrder = defineModel<ArticleOrderType>('sortOrder', { default: 'date' })
const isAscending = defineModel<boolean>('isAscending', { default: false })
```

### 3. 优化 allowAscending 计算属性
确保计算属性始终返回布尔值：
```typescript
const allowAscending = computed(() => {
	const configAllow = appConfig.pagination.allowAscending ?? false
	if (configAllow) {
		return props.disableAscending !== true
	}
	return props.enableAscending === true
})
```

### 4. 使用 HydrateSafe 组件
如果项目中已经有 HydrateSafe 组件，可以使用它来包装可能导致水合问题的部分：
```vue
<UtilHydrateSafe>
  <PostOrderToggle
    v-model:is-ascending="isAscending"
    v-model:sort-order="sortOrder"
    v-model:category="category"
    :categories
  />
</UtilHydrateSafe>
```

### 5. 检查并修复其他可能的问题
- 确保所有组件都有正确的导入
- 检查第三方组件的版本，确保它们支持服务器端渲染
- 避免在模板中使用可能导致不一致的复杂表达式

## 预期效果
通过以上修复，PostOrderToggle 组件的水合问题将得到解决，服务器端渲染的 HTML 与客户端渲染的 HTML 将保持一致，不再出现水合警告。
