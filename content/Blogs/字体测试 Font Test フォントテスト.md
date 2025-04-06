# 字体测试 Font Test フォントテスト

## 中日英混排测试 Mixed Text Test 混合テキストテスト

这是一段中文测试文本，包含 English words 和日本語の単語。测试在同一段落中混合使用不同语言时的显示效果。

### 标题字体测试 Header Font Test ヘッダーフォントテスト

正文字体 Body Font ボディフォント：
- 中文示例：永和九年，岁在癸丑。暮春之初，会于会稽山阴之兰亭。
- English Example: The quick brown fox jumps over the lazy dog.
- 日本語例文：いろはにほへと　ちりぬるを　わかよたれそ　つねならむ

#### 不同级别标题 Different Levels 見出しレベル

##### 五级标题测试 Level 5 Header 第5レベル

###### 六级标题测试 Level 6 Header 第6レベル

### 段落间距测试 Paragraph Spacing 段落の間隔

第一段落：春眠不觉晓，处处闻啼鸟。In this mixed paragraph, we're testing how different scripts flow together in a natural way. そして、日本語もなめらかに混ざり合うことを確認します。

第二段落：夜来风雨声，花落知多少。The spacing between paragraphs should be consistent and readable. 段落と段落の間には適切な余白が必要です。

### 特殊格式测试 Format Test 書式テスト

**粗体文本 Bold Text 太字テキスト**

*斜体文本 Italic Text イタリック体*

`代码文本 Code Text コードテキスト`

> 引用文本：观沧海 / Quote Text / 引用文テキスト
> 东临碣石，以观沧海。水何澹澹，山岛竦峙。
> The mountains and seas stand tall and proud.
> 山と海は堂々と立っています。

### 代码块测试 Code Blocks コードブロック

#### Python 代码示例 Python Example Pythonコード例

```python
# 中文注释：计算斐波那契数列
# English Comment: Calculate Fibonacci sequence
# 日本語コメント：フィボナッチ数列を計算する
def fibonacci(n: int) -> list[int]:
    """多语言文档字符串测试
    Multi-language docstring test
    多言語ドキュメント文字列テスト
    """
    result = [0, 1]
    for i in range(2, n):
        result.append(result[i-1] + result[i-2])
    return result

# 测试代码 Test code テストコード
numbers = fibonacci(10)
print(f"斐波那契数列 Fibonacci sequence フィボナッチ数列: {numbers}")
```

#### TypeScript 代码示例 TypeScript Example TypeScriptコード例

```typescript
// 接口定义 Interface definition インターフェース定義
interface MultiLanguageGreeting {
    chinese: string;  // 中文问候
    english: string;  // English greeting
    japanese: string; // 日本語の挨拶
}

// 类实现 Class implementation クラス実装
class GreetingService {
    private greeting: MultiLanguageGreeting = {
        chinese: "你好，世界！",
        english: "Hello, World!",
        japanese: "こんにちは、世界！"
    };

    public sayHello(language: keyof MultiLanguageGreeting): string {
        return this.greeting[language];
    }
}

// 使用示例 Usage example 使用例
const greeter = new GreetingService();
console.log(greeter.sayHello("chinese"));  // 输出: 你好，世界！
console.log(greeter.sayHello("english"));  // Output: Hello, World!
console.log(greeter.sayHello("japanese")); // 出力: こんにちは、世界！
```

#### 混合代码示例 Mixed Code Example 混合コード例

```typescript
// 带有中日文变量名的代码
// Code with Chinese and Japanese variable names
// 中国語と日本語の変数名を含むコード
const 问候语 = "你好";
const 挨拶 = "こんにちは";
const greeting = "Hello";

type 语言类型 = "中文" | "日本語" | "English";
interface 用户数据 {
    名字: string;
    年齢: number;
    language: 语言类型;
}

const データ: 用户数据 = {
    名字: "张三",
    年齢: 25,
    language: "中文"
};

console.log(`${问候语}, ${データ.名字}!`);
```

