# On this place make `.mcp.json` file


because of fnm you must use full paths for command and args

- command is path to node executable
- args is path to your mcp server file (in this case mcp.ts)

we named "demo-server" but you can name it whatever you want in mcp.ts

we named our tool "add" but you can name it whatever you want in mcp.ts

```json
{
  "mcpServers": {
    "demo-server": {
      "type": "stdio",
      "command": "/run/user/<>/fnm_multishells/<session_id>/bin/node",
      "args": [
        "/home/<user>/<path_to_project>/first-ever-mcp-server/mcp.ts"
      ],
      "env": {
        "NODE_OPTIONS": "--no-deprecation"
      }
    }
  }
}
```
