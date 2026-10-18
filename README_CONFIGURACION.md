# Configuración del agente QA en VS Code

## Opción A: Codex
1. Copia `AGENTS.md` en la raíz de `playwright-automation-framework`, junto a `package.json`.
2. Abre el proyecto completo en VS Code.
3. En el chat de Codex, pide: "Lee AGENTS.md, revisa el framework existente y propón una matriz de escenarios de login y registro antes de escribir tests. No modifiques archivos hasta que apruebe la propuesta".
4. Revisa la matriz y autoriza la implementación.
5. Pide que ejecute `npm run typecheck` y los tests relevantes (según scripts reales de `package.json`).

## Opción B: GitHub Copilot
1. Crea `.github/copilot-instructions.md`.
2. Copia dentro el contenido de `AGENTS.md`.
3. Abre el chat de Copilot en modo agente y pide primero análisis y matriz de cobertura.
4. Revisa los cambios antes de aceptarlos y confirma la ejecución de los tests.

## Importante
- Un archivo de instrucciones no ejecuta tests por sí solo: necesitas un agente de programación compatible, con acceso autorizado al proyecto y al terminal.
- La disponibilidad gratuita de cada agente puede tener límites de uso; no actives planes de pago sin revisarlos.
- El agente puede equivocarse. Revisa assertions, datos, seguridad y evidencias.
- No concedas permisos automáticos para operaciones destructivas o publicación de código.

## Primer prompt recomendado
Analiza este framework de Playwright + TypeScript siguiendo AGENTS.md. Inspecciona los tests y Page Objects existentes. Examina el login y registro de Automation Exercise y presenta una matriz de cobertura priorizada con escenarios positivos, negativos y límites. No escribas código todavía. Indica qué comportamiento verificaste y qué aspectos requieren confirmación.
