import requests

def get_completion(message, context, character_setting=None):
    # 构造 prompt
    prompt = f"""
[角色设定]
{character_setting or ""}

[历史对话]
{_format_context(context)}

[当前用户输入]
User: {message}
Assistant:
"""
    try:
        resp = requests.post("http://chat.corinth.informatik.rwth-aachen.de/completions", json={
            "prompt": prompt,
            "model": "deepseek-r1:70b",      # 需要根据你实际安装的模型名称
            "temperature": 0.7,
        })
        resp.raise_for_status()
        data = resp.json()
        # 具体返回结构需根据Ollama版本进行解析
        text = data.get("completion", "")  # 假设
        return text
    except Exception as e:
        raise e

def _format_context(context):
    lines = []
    for c in context:
        lines.append(f"{c.role}: {c.content}")
    return "\n".join(lines)
