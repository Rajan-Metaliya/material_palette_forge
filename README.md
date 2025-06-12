# 🎨 Material Palette Forge

**Material Palette Forge** is a powerful Next.js-based theme builder for creating, customizing, and previewing **Material Design 3** inspired themes. It’s a visual-first tool that bridges the gap between **design and development**—allowing you to fine-tune every aspect of a design system and export usable code for Flutter, JSON, or Figma Tokens.

---

## 🚀 Key Features

### 🌈 Color Customization (Light & Dark Modes)
- Define a **Seed Color** to auto-generate Material 3-like palettes for both **light** and **dark** themes.
- Fine-tune all core and extended color roles for both modes (`primary`, `secondary`, `surface`, `error`, etc.).

<!-- 📸 IMAGE SUGGESTION: Screenshot showing color palette generation with light/dark toggle. -->

### 🔤 Font Customization (with Light & Dark Text Colors)
- Full control over Material Text Styles:
  - Display, Headline, Title, Body, Label (Large/Medium/Small).
- Add and configure **custom text styles** with:
  - Font Family, Size, Weight, Letter Spacing, Line Height
  - Specific **text color** for both light and dark modes

<!-- 📸 IMAGE SUGGESTION: Font style editor showing light/dark preview side-by-side. -->

### ⚙️ Property Customization
Define named tokens for extended design values:
- **Spacing**: `small`, `medium`, `containerPadding`
- **Border Radius**, **Border Width**, **Opacity**, **Elevation (box shadows)**, **Gradients**

All tokens are converted into Flutter **ThemeExtension** classes with support for dual-mode theming.

<!-- 📸 IMAGE SUGGESTION: Property customization panel showing both modes. -->

### 🌓 Dark & Light Mode Support
- Toggle between **light** and **dark mode** in the builder via the header icon.
- App Preview reflects theme changes in real-time for the selected mode.
- Generated output includes mode-specific data for Flutter, JSON, and Figma Tokens.

### 🧪 Live Preview (Mode-Aware)
- Persistent preview panel mimicking a **Plant Care App UI**.
- Reflects changes in both light and dark modes.
- Inline mini previews next to each field respect the active theme.

<!-- 📸 IMAGE SUGGESTION: Full app preview toggling between light and dark modes. -->

### 📦 Code & Token Generation
Generate theme outputs in various formats with full **dual-mode support**:

#### 🔹 Flutter
- `app_theme.dart` includes:
  - `ColorScheme` for **lightTheme** and **darkTheme**
  - `TextTheme` with support for custom light/dark text colors
  - ThemeExtensions for:
    - `AppSpacing`, `AppBorderRadius`, `AppBorderWidth`, `AppOpacity`, `AppElevation`, `AppGradients`, `AppTextStyles`

#### 🔹 JSON
- Includes `{ light: { ... }, dark: { ... } }` structure for all tokens.

#### 🔹 Figma Tokens
- Generates Figma-compatible design tokens for both themes.

---

## 🧭 How to Use

1. **Toggle Theme Mode**: Use the 🌞/🌙 icon in the header to switch themes.
2. **Navigate Sections**: Use the tabs on the left (`Colors`, `Fonts`, `Properties`).
3. **Seed Color**: In "Colors," define your seed to generate both palettes.
4. **Customize**:
   - Edit light and dark values for color roles.
   - In "Fonts," set font and color values for both modes.
   - In "Properties," manage token definitions.
5. **Observe Preview**:
   - "App Preview" and inline previews update per active theme.
6. **Reset (Optional)**: Reset to default theme values.
7. **Export Output**:
   - Use "Generated Output" section for code in Flutter, JSON, or Figma formats.

---

## 🛠 Tech Stack

- **Next.js** (React framework)
- **TailwindCSS**
- **Dynamic Flutter Code Generator**
- **Design Token Engine**

---

## 📈 Recent Enhancements

- ✅ Dual palette generation via seed color (light & dark)
- ✅ Fully themeable app builder with live toggle
- ✅ Inline previews and sticky UI
- ✅ Custom properties with ThemeExtension support
- ✅ Per-style font colors for both modes
- ✅ Live preview panel & inline visuals
- ✅ Flutter: lightTheme & darkTheme generation
- ✅ JSON & Figma Tokens with mode distinction
- ✅ Input validations for fields and colors
- ✅ Bug fixes for code parsing

---

## 📥 Future Enhancements

- Import/export from real Figma files
- Collaborative token editing
- Flutter integration from shared JSON

---

## 📸 Suggested Screenshots
> Add visuals to boost clarity:
- Seed color and dual palette UI
- Font customization with mode toggle
- Property editor
- Dual-mode app preview
- Code generation view

---

## 👏 Contributing

While this is primarily an internal tool, contributions are welcome for similar workflows. Feel free to fork and PR improvements.

---

## 📄 License

MIT License — © [Your Name or Org]

---

## 🔗 Related Articles

- [Effortless Color Schemes in Flutter](https://medium.com/@rajan.metaliya/advanced-theming-techniques-in-flutter-effortless-color-schemes-part-2-d7ae0db8b156)
- [ThemeCraft Series on Medium](#) <!-- Replace with actual link -->

