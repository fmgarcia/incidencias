/**
 * Middleware de validación con Zod
 * Valida el body, query params y params de la petición
 */

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

// Tipos para los diferentes lugares donde se puede validar
type ValidateTarget = 'body' | 'query' | 'params';

/**
 * Crea un middleware de validación usando un schema de Zod
 * @param schema - Schema de Zod para validar
 * @param target - Parte de la petición a validar (body, query, params)
 */
export const validate = (schema: AnyZodObject, target: ValidateTarget = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[target];

      // Validar los datos con el schema
      const validatedData = await schema.parseAsync(dataToValidate);

      // Reemplazar los datos originales con los validados y parseados
      req[target] = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // El errorHandler global se encargará de formatear el error de Zod
        next(error);
      } else {
        next(error);
      }
    }
  };
};

/**
 * Valida múltiples targets al mismo tiempo
 * @param schemas - Objeto con schemas para cada target
 */
export const validateMultiple = (schemas: Partial<Record<ValidateTarget, AnyZodObject>>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar cada target especificado
      for (const [target, schema] of Object.entries(schemas)) {
        if (schema) {
          const validatedData = await schema.parseAsync(req[target as ValidateTarget]);
          req[target as ValidateTarget] = validatedData;
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
