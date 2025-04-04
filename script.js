// 初始化思维导图容器
const container = document.getElementById('mindmap');
let mind = null;

// 解析 Markdown 为树形结构
function parseMarkdown(text) {
    const tokens = marked.lexer(text);
    const root = { topic: "Root", children: [] };
    const stack = [root];

    tokens.forEach(token => {
        if (token.type === 'heading') {
            const depth = token.depth;
            const node = { topic: token.text, children: [] };

            // 确保层级正确
            while (stack.length > depth) stack.pop();
            const parent = stack[stack.length - 1];
            parent.children.push(node);
            
            // 更新栈
            stack.length = depth;
            stack.push(node);
        } else if (token.type === 'list') {
            const listItems = token.items;
            const lastNode = stack[stack.length - 1];
            
            listItems.forEach(item => {
                lastNode.children.push({ topic: item.text });
            });
        }
    });

    return { nodeData: root };
}

// 渲染思维导图
function renderMindmap(data) {
    if (mind) mind.destroy(); // 销毁旧实例
    mind = new MindElixir({
        el: container,
        data,
        direction: MindElixir.LEFT,
    });
    mind.init();
}

// 实时监听输入
document.getElementById('input').addEventListener('input', function(e) {
    try {
        const data = parseMarkdown(e.target.value);
        renderMindmap(data);
    } catch (error) {
        console.error('解析失败:', error);
    }
});

// 初始化默认内容
renderMindmap(parseMarkdown(document.getElementById('input').value).nodeData);