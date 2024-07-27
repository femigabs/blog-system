// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

// @Injectable()
// export class AuthGuard implements CanActivate {
//     constructor(
//         private readonly databaseRepository: DatabaseRepository,
//     ) { }

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const authHeader = request.headers['authorization'];

//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return false;
//         }

//         const token = authHeader.split(' ')[1];

//         try {

//             const decodedToken = await admin.auth().verifyIdToken(token);

//             request.user = { ...decodedToken, ...user };

//             return true;
//         } catch (error) {
//             return false;
//         }
//     }
// };
