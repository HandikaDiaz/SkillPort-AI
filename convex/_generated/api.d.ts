/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as authAdapter from "../authAdapter.js";
import type * as bankAccounts from "../bankAccounts.js";
import type * as byocInvites from "../byocInvites.js";
import type * as credentials from "../credentials.js";
import type * as escrow from "../escrow.js";
import type * as finances from "../finances.js";
import type * as http from "../http.js";
import type * as messages from "../messages.js";
import type * as milestones from "../milestones.js";
import type * as notifications from "../notifications.js";
import type * as projects from "../projects.js";
import type * as settings from "../settings.js";
import type * as stressTests from "../stressTests.js";
import type * as talentProfiles from "../talentProfiles.js";
import type * as transactions from "../transactions.js";
import type * as userSettings from "../userSettings.js";
import type * as users from "../users.js";
import type * as wallets from "../wallets.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  authAdapter: typeof authAdapter;
  bankAccounts: typeof bankAccounts;
  byocInvites: typeof byocInvites;
  credentials: typeof credentials;
  escrow: typeof escrow;
  finances: typeof finances;
  http: typeof http;
  messages: typeof messages;
  milestones: typeof milestones;
  notifications: typeof notifications;
  projects: typeof projects;
  settings: typeof settings;
  stressTests: typeof stressTests;
  talentProfiles: typeof talentProfiles;
  transactions: typeof transactions;
  userSettings: typeof userSettings;
  users: typeof users;
  wallets: typeof wallets;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
