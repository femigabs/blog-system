
export class CreateUserDto {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
};

export class LoginUserDto {
    username: string;
    password: string;
};