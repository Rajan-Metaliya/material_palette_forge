# 🎨 Material Palette Forge

**Material Palette Forge** is a powerful Next.js-based theme builder for creating, customizing, and previewing **Material Design 3** inspired themes. It’s a visual-first tool that bridges the gap between **design and development**—allowing you to fine-tune every aspect of a design system and export usable code for Flutter, JSON, or Figma Tokens.

---

## 🚀 Key Features

### 🌈 Color Customization
- Define a **Seed Color** to auto-generate a Material 3-like palette.
- Fine-tune core roles: `primary`, `secondary`, `surface`, `error`, and their container/variant forms.
- Live preview updates UI elements in real-time.

<!-- 📸 IMAGE SUGGESTION: Insert screenshot showing color palette generation and seed color input. -->

### 🔤 Font Customization
- Full control over Material Text Styles:
  - Display, Headline, Title, Body, Label (Large/Medium/Small).
- Add and configure custom text styles:
  - Font Family, Size, Weight, Letter Spacing, Line Height.

<!-- 📸 IMAGE SUGGESTION: Inline font editor with live preview showing how changing font family/size affects UI. -->

### ⚙️ Property Customization
Define named tokens for extended design values:
- **Spacing**: `small`, `medium`, `containerPadding`
- **Border Radius**: `cardRadius`, `buttonRadius`
- **Border Width**, **Opacity**, **Elevation (box shadows)**, **Gradients**

All these tokens are converted into **Flutter `ThemeExtension` classes**.

<!-- 📸 IMAGE SUGGESTION: Screenshot showing custom property list and gradient configuration. -->

### 🧪 Live Preview
- Persistent side panel mimicking a **Plant Care App UI**.
- Reflects all color, font, and property changes live.
- Inline mini previews next to input fields for instant feedback.

<!-- 📸 IMAGE SUGGESTION: Full app preview UI panel with split-screen showing before/after theme effects. -->

### 📦 Code & Token Generation
Generate theme outputs in various formats:

#### 🔹 Flutter
- `app_theme.dart` includes:
  - `ColorScheme`
  - `TextTheme`
  - `ThemeExtensions` for:
    - `AppSpacing`
    - `AppBorderRadius`
    - `AppBorderWidth`
    - `AppOpacity`
    - `AppElevation`
    - `AppGradients`
    - `AppTextStyles` (custom fonts)

#### 🔹 JSON
- Complete representation of the full theme config.

#### 🔹 Figma Tokens
- Compatible with the Figma Tokens plugin.

---

## 🧭 How to Use

1. **Navigate Tabs**: Use the left panel (`Colors`, `Fonts`, `Properties`) to explore and customize.
2. **Pick Seed Color**: In the `Colors` tab, define a seed color to generate a base palette.
3. **Customize Your Theme**:
   - Colors: Adjust individual color roles.
   - Fonts: Modify existing or add new text styles.
   - Properties: Add custom tokens for spacing, borders, etc.
4. **Observe Changes**: Watch live preview on the right and inline previews beside fields.
5. **Reset Anytime**: Use "Reset to Defaults" if you want to start fresh.
6. **Export Your Theme**: Choose from Flutter, JSON, or Figma Tokens output.

---

## 🛠 Tech Stack

- **Next.js** (React framework)
- **TailwindCSS**
- **Custom Token Logic**
- **Dynamic Code Generator (Flutter, JSON, Figma)**

---

## 📈 Improvements from Collaboration

Here’s a summary of major updates done collaboratively:

- ✅ Seed Color → Auto Material Palette
- ✅ Detailed ThemeExtensions for spacing, gradients, etc.
- ✅ Inline visual previews
- ✅ Sticky real-time UI preview panel
- ✅ Input validation on properties
- ✅ Bug fixes for parsing/stray characters
- ✅ Overhauled font and text style system

---

## 📥 Future Enhancements

- Import/export from real Figma files via plugin.
- Collaborative design tokens with versioning.
- Web-to-Flutter auto theming bridge.

---

## 📸 Suggested Screenshots
> Upload these to enhance your README:
- Color palette generator UI
- Font customization with inline preview
- App Preview Panel (Plant Care app sample)
- Code generation screen for Flutter & JSON

---

## 👏 Contributing

This is an internal tool, but feel free to fork or contribute if you're working on similar design-dev bridges. Contributions are welcome via PRs and issues.

---

## 📄 License

MIT License — © [Your Name or Org]

---

## 🔗 Related Articles

- [Effortless Color Schemes in Flutter](https://medium.com/@rajan.metaliya/advanced-theming-techniques-in-flutter-effortless-color-schemes-part-2-d7ae0db8b156)
- [ThemeCraft Series on Medium](#) <!-- Replace with actual link -->

