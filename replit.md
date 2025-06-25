# Portfolio Website

## Overview

This is a full-stack portfolio website built with React, Node.js, Express, and PostgreSQL. It features a modern, responsive design with both public-facing pages and an admin dashboard for content management. The application showcases personal information, work experience, projects, blog posts, and provides a contact form for visitors.

## System Architecture

The application follows a traditional client-server architecture with clear separation between frontend and backend:

- **Frontend**: React-based SPA with TypeScript, built with Vite
- **Backend**: Express.js REST API server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication for admin access
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Deployment**: Configured for Replit with autoscale deployment

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** as the build tool for fast development and optimized production builds
- **wouter** for lightweight client-side routing
- **TanStack Query** for server state management and caching
- **Tailwind CSS** with shadcn/ui component library for consistent UI
- **Framer Motion** for animations and transitions
- **Theme Support** with light/dark mode toggle

### Backend Architecture
- **Express.js** server with TypeScript
- **JWT authentication** for admin panel access
- **RESTful API** design with proper error handling
- **Middleware** for logging, authentication, and request parsing
- **File serving** for static assets in production

### Database Schema
The application uses Drizzle ORM with PostgreSQL and includes the following main entities:
- **Users**: Admin authentication
- **User Profiles**: Personal information and bio
- **Skills**: Technical skills with categories and proficiency levels
- **Experiences**: Work history and roles
- **Projects**: Portfolio projects with descriptions and links
- **Blog Posts**: Articles with markdown content support
- **Contact Messages**: Visitor inquiries and messages

### Authentication System
- **JWT-based authentication** for admin access
- **Token storage** in localStorage
- **Protected routes** for admin dashboard
- **Session verification** middleware

## Data Flow

1. **Public Pages**: Direct API calls to fetch content (profile, skills, experiences, projects, blog posts)
2. **Admin Authentication**: Login form → JWT token → protected admin routes
3. **Content Management**: Admin dashboard → authenticated API calls → database updates
4. **Contact Form**: Public form → API endpoint → database storage
5. **Real-time Updates**: TanStack Query provides automatic cache invalidation and refetching

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui**: Accessible UI primitives
- **jsonwebtoken**: JWT authentication
- **wouter**: Lightweight router
- **framer-motion**: Animation library

### UI Components
- **shadcn/ui**: Pre-built accessible components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

### Development Tools
- **TypeScript**: Type safety across the stack
- **Vite**: Fast build tool with HMR
- **ESBuild**: JavaScript bundler for production
- **tsx**: TypeScript execution for development

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Environment
- **Node.js 20** runtime
- **PostgreSQL 16** database
- **Hot reload** with Vite dev server
- **Concurrent development** with Express server proxy

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Static serving**: Express serves built frontend in production
- **Environment variables**: DATABASE_URL and JWT_SECRET required

### Replit Configuration
- **Auto-scaling deployment** target
- **Port 5000** for local development
- **Port 80** for external access
- **Build and start scripts** configured in package.json

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```