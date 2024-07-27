export interface UserEntity {
    id?: number;
    firstName: string;
    lastName: string;
    username: string;
    salt?: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date
};

export interface LoginUserEntity {
    id?: number;
    firstName: string;
    lastName: string;
    username: string;
    salt?: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    token: string
};

export interface TokenEntity {
    userId: number;
    username: string;
};

export interface PasswordEntity {
    salt: string;
    hash: string;
};