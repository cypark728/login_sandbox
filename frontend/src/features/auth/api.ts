import { apiRequest } from '../../shared/api/apiClient';
import type { Attempt, Credentials, Problem, User } from './types';

export function register(credentials: Credentials): Promise<User> {
  return apiRequest<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function login(credentials: Credentials): Promise<User> {
  return apiRequest<User>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function logout(): Promise<void> {
  return apiRequest<void>('/auth/logout', { method: 'POST' });
}

export function getMe(): Promise<User> {
  return apiRequest<User>('/me');
}

export function getMyAttempts(): Promise<Attempt[]> {
  return apiRequest<Attempt[]>('/me/attempts');
}

export function getProblems(): Promise<Problem[]> {
  return apiRequest<Problem[]>('/problems');
}

export function solveProblem(problemId: number): Promise<Attempt> {
  return apiRequest<Attempt>('/attempts', {
    method: 'POST',
    body: JSON.stringify({ problemId }),
  });
}
