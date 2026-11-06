import { t } from "elysia";

export const AuthModel = {
    loginRequest: t.Object({
        email: t.String({
            format: 'email',
            examples: 'janedoe@mail.com'
        }),
        password: t.String({minLength: 8, examples: 'password123'}),
    }),

    loginResponse: t.Object({
        token: t.String({examples: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'}),
        user: t.Object({
            id: t.Integer({examples: 1}),
            username: t.String({examples: 'janedoe'}),
            email: t.String({ format: 'email', examples: 'janedoe@mail.com'})
        })
    }),

    registerRequest: t.Object({
        username: t.String({minLength: 1,examples: ['janedoe']}),
        email: t.String({ format: 'email', examples: 'janedoe@mail.com'}),
        password: t.String({minLength: 8, examples: 'password123'} ),
    }),

    registerResponse: t.Object({
        message: t.String({examples: 'User created successfully'}),
        user: t.Object({
            id: t.Integer({examples: 1}),
            username: t.String({examples: 'janedoe'}),
            email: t.String({ format: 'email', examples: 'janedoe@mail.com'})
        })
    })


}

export type LoginBody = typeof AuthModel.loginRequest.static;
export type LoginResponse = typeof AuthModel.loginResponse.static;
export type RegisterBody = typeof AuthModel.registerRequest.static;
export type RegisterResponse = typeof AuthModel.registerResponse.static;