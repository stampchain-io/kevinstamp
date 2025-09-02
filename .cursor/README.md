# 🎯 Cursor IDE Configuration for KEVIN Stamp Website

This directory contains Cursor-specific configurations optimized for the KEVIN Stamp website development workflow.

## 📁 Configuration Files

### `.cursorrules`
**Project Guidelines & Standards**
- Comprehensive coding standards for the project
- File structure conventions
- API handling patterns
- Replit compatibility requirements
- Performance and security considerations

### `settings.json`
**IDE Preferences**
- TypeScript strict mode configuration
- Tailwind CSS integration
- Auto-imports and formatting settings
- ESLint integration
- File associations for optimal editing experience

### `tasks.json`
**Build Tasks**
- Development server (`npm run dev`)
- Production build (`npm run build`)
- TypeScript checking (`npm run check`)
- Database schema updates (`npm run db:push`)

### `composer.json`
**Workflow Automation**
- New component creation workflow
- Page creation with routing setup
- Standardized file templates
- Automated imports and structure

### `hooks.json`
**Git Hooks**
- Pre-commit: TypeScript checking and linting
- Pre-push: Build verification
- Post-merge: Dependency installation

### `.cursorignore`
**File Exclusions**
- Dependencies and build outputs
- Environment files
- IDE-specific files
- Cache directories
- Large asset files

## 🚀 Getting Started with Cursor

1. **Open the Project**: Open the KEVIN Stamp website folder in Cursor
2. **Automatic Setup**: Cursor will automatically apply settings from `.cursor/settings.json`
3. **Project Rules**: Read `.cursorrules` for comprehensive project guidelines
4. **Development**: Use Command Palette → Tasks → Run Task → dev

## 🎯 Key Features

### Smart Code Completion
- TypeScript-aware autocompletion
- Tailwind CSS class suggestions
- React component auto-imports
- Path alias resolution (`@/` and `@shared/`)

### Integrated Development
- Hot reload with Vite
- Real-time TypeScript error checking
- ESLint integration
- Prettier formatting on save

### Workflow Automation
- Component creation workflows
- Standardized file templates
- Automated build and test tasks
- Git hook integration

## 🔧 Customization

### Adding New Tasks
Edit `tasks.json` to add custom build tasks:
```json
{
  "label": "custom-task",
  "type": "shell",
  "command": "your-command-here",
  "group": "build"
}
```

### Custom Workflows
Edit `composer.json` to add development workflows:
```json
{
  "name": "Custom Workflow",
  "description": "Description of workflow",
  "steps": [
    // Workflow steps
  ]
}
```

### Project Rules Updates
Edit `.cursorrules` to update coding standards and guidelines as the project evolves.

## 🎨 Design System Integration

The Cursor configuration includes:
- **Tailwind CSS**: Full IntelliSense support
- **Custom Colors**: KEVIN theme color palette
- **Component Library**: shadcn/ui integration
- **TypeScript**: Strict type checking
- **React**: Modern React patterns

## 🔄 Replit Compatibility

All configurations are designed to be:
- **Replit-compatible**: No platform-specific dependencies
- **Cross-platform**: Works on macOS, Linux, Windows
- **Git-friendly**: All configs are version-controlled
- **Team-ready**: Standardized setup for all developers

## 📊 Performance Optimizations

Cursor configurations include:
- **File exclusions**: Faster indexing and search
- **Smart caching**: Optimized for large codebases
- **Background tasks**: Non-blocking build processes
- **Selective watching**: Only relevant files monitored

## 🐛 Troubleshooting

### Common Issues
- **Settings not applying**: Restart Cursor
- **Tasks not showing**: Reload window (Cmd/Ctrl + Shift + P → "Developer: Reload Window")
- **TypeScript errors**: Run `npm run check` to verify

### Reset Configuration
If you need to reset Cursor settings for this project:
1. Delete `.cursor/` directory
2. Restart Cursor
3. Reopen the project folder

## 📞 Support

For Cursor-specific issues or questions:
- Check `.cursorrules` for project standards
- Use integrated terminal for build commands
- Leverage Composer workflows for automation

---

*Optimized for KEVIN Stamp Website development with Cursor IDE* 🎯

