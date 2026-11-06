export class AppError extends Error {
    constructor(
        public override message: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = 'Invalid request data') {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Access denied') {
        super(message, 401);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource is already exist') {
        super(message, 409);
    }
}