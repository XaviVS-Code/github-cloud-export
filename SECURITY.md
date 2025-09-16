# Security Policy

## Supported Versions

| Version | Status     |
|---------|------------|
| 1.0.1   | Active     |
| <1.0.1  | Deprecated |

## Content Security Policy (CSP)

```json
"content_security_policy": {
  "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
}
```

- No remote scripts
- No `unsafe-eval`
- WebAssembly allowed for zip logic

## Permissions

- `"identity"` for OAuth
- `"downloads"` for file export
- `"storage"` for local config
- `"host_permissions"` scoped to GitHub, Google Drive, Dropbox, OneDrive

## Known Issues

- OneDrive integration pending sandbox unlock
- OAuth tokens scoped to minimal permissions
- PowerShell PATH ghost resolved via manual aliasing

## Patch Notes

- **v1.0.1**: Hardened CSP, upgraded Electron to 38.1.0, resolved npm PATH ghost
