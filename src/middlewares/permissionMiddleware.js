import { Permission, Role, RolePermission } from "../models/index.js";
import { cacheKeys, getCache, setCache } from "../services/cache.service.js";

export function authorizePermission(permissionName) {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const cacheKey = cacheKeys().permission(
                req.user.companyId,
                req.user.role,
                permissionName
            );
            const cachedPermission = await getCache(cacheKey);

            if (cachedPermission?.allowed) {
                return next();
            }

            const role = await Role.findOne({
                where: {
                    name: req.user.role,
                    companyId: req.user.companyId,
                },
            });

            if (!role) {
                return res.status(403).json({
                    success: false,
                    message: "Role not found",
                });
            }

            const permission = await Permission.findOne({
                where: {
                    name: permissionName,
                },
            });

            if (!permission) {
                return res.status(403).json({
                    success: false,
                    message: "Permission not found",
                });
            }

            const rolePermission = await RolePermission.findOne({
                where: {
                    roleId: role.id,
                    permissionId: permission.id,
                },
            });

            if (!rolePermission) {
                return res.status(403).json({
                    success: false,
                    message: "Permission denied",
                });
            }

            await setCache(cacheKey, {
                allowed: true,
                roleId: role.id,
                permissionId: permission.id,
            }, 600);

            next();
        } catch (error) {
            next(error);
        }
    };
}
