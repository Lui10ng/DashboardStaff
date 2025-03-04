# TypeScript Types Documentation

This file serves as documentation for the TypeScript types used throughout the application.

## How to Use This File

1. Document all shared types in this file
2. Include descriptions for complex types
3. Group related types together

// sample
export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
};
