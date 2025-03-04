## What Are Stores?

Stores in Svelte are containers for state that you want to access from multiple components. They help you manage data that needs to be shared across your application.

## What Should You Store?

Good candidates for stores include:

- **User information** (logged-in status, preferences)
- **UI state** (dark/light theme, sidebar open/closed)
- **Application data** that multiple components need
- **Form data** that persists between page navigations
- **API response cache**
- **Global settings or configurations**