import type { JWT } from '../../config/jwt';
import { db } from "../../config/db";
import { ConflictError, UnauthorizedError } from "../../errors/custom.error";
import { LoginBody, LoginResponse, RegisterBody, RegisterResponse } from "./auth.model";
import type { Logger } from "pino";

export class AuthService {
    public static async login(data: LoginBody, jwt: JWT, log?: Logger): Promise<LoginResponse> 
    {
        const {email, password} = data;
        const user = await db.user.findUnique({where: {email}});
        if(!user){
            log?.warn({message: 'Email is not registered'}, email);
            throw new UnauthorizedError('Invalid credentials');
        }
        const validPassword = await Bun.password.verify(password, user.password);
        if(!validPassword){
            log?.warn({message: 'Password is not valid for email'}, email);
            throw new UnauthorizedError('Invalid credentials');
        }
        const token = await jwt.sign({
            sub: user.id.toString()
        });
        log?.info({message: "Login successfully"}, email);
        return { 
            token: token,
            user : {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };
    }

    public static async register(data: RegisterBody, log?:Logger): Promise<RegisterResponse> 
    {
        const {email, password, username} = data;
        const existingUser = await db.user.findUnique({where: {email}});

        if(existingUser){
            log?.warn({message: 'Email is already registered'}, email);
            throw new ConflictError('Email is already registered');
        }
        const hashedPassword = await Bun.password.hash(password);
        const user = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                username
            }
        });
        log?.info({message: "User created successfully"}, email);
        return { 
            message: 'User created successfully',
            user : {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };
    } 
}


