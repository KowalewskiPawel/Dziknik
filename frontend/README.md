# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list


## Figma Dziknik project design information

Dziknik web design is made completely from scratch. It uses free of charge assets as of initial state.

> [!NOTE]
> **Project basic information:**
> - whole project sizing based on multiplier by 8;
> - initial project done for desktop only (1440 px wide);
> - 12 column for future responsivnes (8 - tablet, 6 - mobile);
> - 160 px left/right margin - 1120 px main window width;
> - 32 px gutter;
> - 64 px col width;
>
> * colors: https://coolors.co/c97681-bc7e49-d6b08b-162731-215777
> - additional colors: [#F3960B, ]
>
> * fonts:
> - main: https://fonts.google.com/specimen/Bevan?query=bevan
> - support: https://fonts.google.com/?query=lato