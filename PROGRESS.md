# eSim IC Management Portal - Progress Document

## 📊 Overview
**Project**: eSim IC Management Portal  
**Tech Stack**: Next.js 14 (App Router), TypeScript, Prisma (Neon Postgres), Tailwind CSS, shadcn/ui, TanStack Table  
**Current State**: Intern workflows (Phase 3) are nearing completion. The codebase is thoroughly stabilized with zero build errors. Preparing to transition to the Admin Portal (Phase 4).

---

## 🚀 Phase Tracking

| Phase | Description | Status | Notes |
|-------|-------------|--------|-------|
| **Phase 0** | Project Scaffolding | ✅ **Done** | Next.js app setup, Tailwind, shadcn registry added. |
| **Phase 1** | Database Schema & Seed | ✅ **Done** | Prisma schema (`IC`, `User`, `ICTask`, etc.) and `seed.ts` fully implemented. |
| **Phase 2** | Role-based Layouts & Auth | ✅ **Done** | Mock auth via `dev-user-switcher.tsx` & server-side cookie parsing. |
| **Phase 3a** | Intern Dashboard | ✅ **Done** | Task cards, status badges, and server actions (`updateTaskStatus`) working. |
| **Phase 3b** | Intern Browse (IC Lobby) | ⏳ **In Progress** | TanStack Table w/ server-side pagination & `claimTaskAction` atomic transactions built. Awaiting visual confirmation. |
| **Phase 3c** | Request New IC | ❌ **Pending** | Modal with regex validation and AddRequest fallback implementation next. |
| **Phase 4a** | Admin Dashboard | ❌ **Pending** | Stats cards, RLS queries, and universal IC/Intern status tables overview. |
| **Phase 4b** | Admin Bulk Assign | ❌ **Pending** | Multi-select ICs and assign to interns via batch actions. |
| **Phase 4c** | Admin DB Management | ❌ **Pending** | CRUD for ICs, batch uploads, and alias resolution. |

---

## 🛠️ Recent Technical Resolutions
1. **Next.js Cookie Constraints**: Fixed the `Cookies can only be modified in a Server Action or Route Handler` 500-error. Dev mock authentication is now robustly handled by a dedicated route handler (`/api/dev/login-default/route.ts`), keeping RSCs strictly standard.
2. **TypeScript Strictness**: Resolved TS errors across the board, notably handling strict null checks `val` in the dropdown states (`val: string | null`).
3. **shadcn/ui Refactoring**: Eliminated warning-causing instances of `<Button asChild>` mismatched with internal `<Link>`s.
4. **Build Stability**: `npm run build` now exits successfully with code `0`. 

---

## 📝 Key Architectural Rules Observed
- **Concurrency Protection**: Ensuring Inter task-claim actions use Prisma `$transaction` blocks so Interns strictly cannot exceed the 3-IC limit.
- **Data Grids**: Offloading pagination and filtering to the server using URL `searchParams` with TanStack React Table to handle the 800+ IC database efficiently.

## 🔜 Next Immediate Steps
1. Verify behavior of `/intern/browse` (Phase 3b UI).
2. Scaffold and implement the "Request New IC" modal (Phase 3c).
3. Begin massive Admin data fetching queries (Phase 4).
