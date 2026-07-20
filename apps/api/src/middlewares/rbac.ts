import { Role } from '@prisma/client';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

/**
 * Middleware factory that enforces Role-Based Access Control (RBAC).
 *
 * Usage:
 *   router.delete('/admin/users/:id', requireAuth, requireRole('ADMIN'), ...)
 *   router.patch('/reports/:id', requireAuth, requireRole('MODERATOR', 'ADMIN'), ...)
 */
export const requireRole = (...roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as Role | undefined;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `This action requires one of the following roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};