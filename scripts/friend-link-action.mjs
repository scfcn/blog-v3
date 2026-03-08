import { execSync } from 'node:child_process'
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'

const FEEDS_FILE = process.env.FEEDS_FILE || 'app/feeds.ts'
const ACTION = process.env.ACTION

function setOutput(name, value) {
	if (process.env.GITHUB_OUTPUT) {
		appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`)
	}
}

function getTodayDate() {
	return new Date().toISOString().split('T')[0]
}

function createEntry(data, validArchs) {
	const entry = {
		author: data.author,
		sitenick: data.sitenick || '',
		title: data.title,
		desc: data.desc,
		link: data.link,
		feed: data.feed || '',
		icon: data.avatar,
		avatar: data.avatar,
		archs: validArchs || [],
		date: getTodayDate(),
		comment: data.comment || '',
	}
	return entry
}

function formatEntry(entry, indent = '\t\t\t') {
	const lines = ['{']
	lines.push(`${indent}author: '${escapeString(entry.author)}',`)
	if (entry.sitenick) {
		lines.push(`${indent}sitenick: '${escapeString(entry.sitenick)}',`)
	}
	else {
		lines.push(`${indent}sitenick: '',`)
	}
	lines.push(`${indent}title: '${escapeString(entry.title)}',`)
	lines.push(`${indent}desc: '${escapeString(entry.desc)}',`)
	lines.push(`${indent}link: '${escapeString(entry.link)}',`)
	lines.push(`${indent}feed: '${escapeString(entry.feed || '')}',`)
	lines.push(`${indent}icon: '${escapeString(entry.icon)}',`)
	lines.push(`${indent}avatar: '${escapeString(entry.avatar)}',`)
	if (entry.archs && entry.archs.length > 0) {
		lines.push(`${indent}archs: [${entry.archs.map(a => `'${escapeString(a)}'`).join(', ')}],`)
	}
	lines.push(`${indent}date: '${entry.date}',`)
	if (entry.comment) {
		lines.push(`${indent}comment: '${escapeString(entry.comment)}',`)
	}
	lines.push(`${indent.slice(0, -1)}},`)
	return lines.join('\n')
}

function escapeString(str) {
	if (!str)
		return ''
	return str.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\n/g, '\\n')
}

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findEntryPosition(content, link) {
	const linkPattern = new RegExp(`link:\\s*['"\`]${escapeRegExp(link)}['"\`]`, 'i')
	const lines = content.split('\n')

	for (let i = 0; i < lines.length; i++) {
		if (linkPattern.test(lines[i])) {
			let startIndex = -1
			for (let j = i; j >= 0; j--) {
				if (lines[j].includes('{') && !lines[j].includes('}')) {
					startIndex = j
					break
				}
			}

			if (startIndex === -1)
				return null

			let braceCount = 0
			let endIndex = startIndex
			let foundStart = false

			for (let j = startIndex; j < lines.length; j++) {
				for (const char of lines[j]) {
					if (char === '{') {
						braceCount++
						foundStart = true
					}
					else if (char === '}') {
						braceCount--
						if (foundStart && braceCount === 0) {
							endIndex = j
							break
						}
					}
				}
				if (foundStart && braceCount === 0)
					break
			}

			return { startIndex, endIndex }
		}
	}
	return null
}

function findGroupEndPosition(content, groupName) {
	const groupPattern = new RegExp(`name:\\s*['"\`]${escapeRegExp(groupName)}['"\`]`)
	const lines = content.split('\n')

	for (let i = 0; i < lines.length; i++) {
		if (groupPattern.test(lines[i])) {
			let entriesStart = -1
			for (let j = i; j < lines.length; j++) {
				if (lines[j].includes('entries: [')) {
					entriesStart = j
					break
				}
			}

			if (entriesStart === -1)
				return -1

			let bracketCount = 0
			let foundStart = false

			for (let j = entriesStart; j < lines.length; j++) {
				for (const char of lines[j]) {
					if (char === '[') {
						bracketCount++
						foundStart = true
					}
					else if (char === ']') {
						bracketCount--
						if (foundStart && bracketCount === 0) {
							return j
						}
					}
				}
			}
		}
	}
	return -1
}

function addEntry(content, data, validArchs) {
	const entry = createEntry(data, validArchs)
	const existingPos = findEntryPosition(content, data.link)

	if (existingPos) {
		return { success: false, message: '该链接已存在于友链中' }
	}

	const groupEndIndex = findGroupEndPosition(content, '『网上邻居』')
	if (groupEndIndex === -1) {
		return { success: false, message: '未找到目标分组' }
	}

	const lines = content.split('\n')
	const entryStr = formatEntry(entry, '\t\t\t')

	lines.splice(groupEndIndex, 0, entryStr)

	return { success: true, content: lines.join('\n'), entry }
}

function removeEntry(content, link) {
	const pos = findEntryPosition(content, link)

	if (!pos) {
		return { success: false, message: '未找到该友链' }
	}

	const lines = content.split('\n')
	lines.splice(pos.startIndex, pos.endIndex - pos.startIndex + 1)

	return { success: true, content: lines.join('\n') }
}

function updateEntry(content, data, validArchs) {
	const pos = findEntryPosition(content, data.link)

	if (!pos) {
		return { success: false, message: '未找到该友链，将尝试添加' }
	}

	const entry = createEntry(data, validArchs)
	const lines = content.split('\n')
	const entryStr = formatEntry(entry, '\t\t\t')

	lines.splice(pos.startIndex, pos.endIndex - pos.startIndex + 1, entryStr)

	return { success: true, content: lines.join('\n'), entry }
}

function gitCommit(message) {
	try {
		execSync('git config user.name "github-actions[bot]"', { stdio: 'inherit' })
		execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', { stdio: 'inherit' })
		execSync(`git add ${FEEDS_FILE}`, { stdio: 'inherit' })
		execSync(`git commit -m "${message}"`, { stdio: 'inherit' })
		execSync('git push', { stdio: 'inherit' })
		return true
	}
	catch (error) {
		console.error('Git operation failed:', error.message)
		return false
	}
}

function main() {
	let checkResult = {}
	try {
		checkResult = JSON.parse(readFileSync('check-result.json', 'utf8'))
	}
	catch (e) {
		console.error('Failed to read check-result.json:', e.message)
		process.exit(1)
	}

	const data = checkResult.data
	if (!data || !data.link) {
		console.error('No valid data found')
		process.exit(1)
	}

	const validArchs = checkResult.archsValid?.validArchs || []

	let content
	try {
		content = readFileSync(FEEDS_FILE, 'utf8')
	}
	catch (e) {
		console.error('Failed to read feeds file:', e.message)
		process.exit(1)
	}

	let result
	let commitMessage

	switch (ACTION) {
		case 'add':
			if (!checkResult.allPassed) {
				setOutput('result', '❌ 检测未通过，无法添加友链')
				process.exit(0)
			}
			result = addEntry(content, data, validArchs)
			commitMessage = `feat(friend-link): add ${data.author}'s blog\n\nCloses #${data.issueNumber}`
			break
		case 'remove':
			result = removeEntry(content, data.link)
			commitMessage = `feat(friend-link): remove ${data.author}'s blog\n\nCloses #${data.issueNumber}`
			break
		case 'update':
			result = updateEntry(content, data, validArchs)
			commitMessage = `feat(friend-link): update ${data.author}'s blog\n\nCloses #${data.issueNumber}`
			break
		default:
			console.log('Unknown action:', ACTION)
			process.exit(1)
	}

	if (!result.success) {
		setOutput('result', `❌ ${result.message}`)
		process.exit(0)
	}

	writeFileSync(FEEDS_FILE, result.content)

	if (gitCommit(commitMessage)) {
		setOutput('result', `✅ 友链已成功${ACTION === 'add' ? '添加' : ACTION === 'remove' ? '移除' : '更新'}`)
	}
	else {
		setOutput('result', '⚠️ 文件已修改但提交失败，请手动检查')
	}
}

main()
