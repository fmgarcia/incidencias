/**
 * Utilidades de paginación
 */

export interface PaginationParams {
  skip: number;
  take: number;
}

export function paginate(page: number = 1, limit: number = 20): PaginationParams {
  const skip = (page - 1) * limit;
  const take = limit;

  return { skip, take };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function getPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
